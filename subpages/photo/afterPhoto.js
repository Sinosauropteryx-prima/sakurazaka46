// 画像レタリング後に実行

// head内のstyleタグを取得
const styleTag = document.querySelector('head style');
// pictureLボタンを取得
const pictureL = document.getElementById('pictureL');
// fileDataUpフィールドを取得
const fileDataUp = document.getElementById('fileDataUp');
// fileDataDownフィールドを取得
const fileDataDown = document.getElementById('fileDataDown');
// 現在の画像のid保持
let currentID = 0;
// photoフィールドを取得
const photo = document.getElementById("photo");

// 監視中かどうかを管理するフラグ
let isObserving = false;

// 各要素ごとのタイマーIDを管理するMap
const observerTimers = new Map();

// IntersectionObserver のインスタンス作成（threshold を 0.9以上 にしてほぼ完全表示時のみ反応）
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.9) { // ほぼ完全に表示
      if (!observerTimers.has(entry.target)) {
        const timer = setTimeout(() => {
          // 画像のid
          currentID = Number(entry.target.id);
          // 画像url書き換え
          const src = entry.target.getAttribute('src');
          let newSrc = src.replace(/\/圧縮\//g, "/");
          entry.target.setAttribute('src', newSrc);
          console.log("Source: " + newSrc);
          // 画像説明書き換え
           // 挿入場所
          const inEventName = document.getElementById("eventName");
          const inStartDate = document.getElementById("startDate");
          const inSubGroup = document.getElementById("subGroup");
          const inFileName = document.getElementById("fileName");
           // fileName
          let existChk = 0; // fileNameが存在したら1
          const inFile = entry.target.closest(".inFile");
          const fileGroup = inFile.closest(".fileGroup");
          if (fileGroup != null) {
            const fileName = fileGroup.querySelector(".fileName");
            inFileName.textContent = fileName.textContent;
            existChk = 1;
          } else {
            inFileName.textContent = "";
          }
           // subGroup
          const subGroup = inFile.closest(".subGroup");
          if (subGroup != null) {
            const subgroupName = subGroup.querySelector(".subgroupName");
            if (existChk == 0) {
              inSubGroup.textContent = subgroupName.textContent;
            } else {
              inSubGroup.textContent = subgroupName.textContent + " / ";
            }
          } else {
            inSubGroup.textContent = "";
          }
           // eventName,startDate
          const frameBox = inFile.closest(".eventGroup").querySelector(".frameBox");
          inEventName.textContent = frameBox.querySelector(".eventName").textContent;
          inStartDate.textContent = frameBox.querySelector(".startDate").textContent;
          observerTimers.delete(entry.target);
        }, 300); 
        observerTimers.set(entry.target, timer);
      }
    } else {
      if (observerTimers.has(entry.target)) {
        clearTimeout(observerTimers.get(entry.target));
        observerTimers.delete(entry.target);
      }
    }
  });
}, { threshold: 0.9 });  // しきい値を0.9に変更

// グローバル変数
let timeoutId;

// 画像の onclick イベントで呼ばれる関数
function handleMediaClick(event) {
  if (!isObserving) {
    isObserving = true;
    console.log("監視開始");

    // 最新の要素を取得して observer に登録
    document.querySelectorAll('#photo .eventGroup .inFile img, #photo .eventGroup .inFile video')
      .forEach(el => observer.observe(el));

    // 画像拡大表示用のスタイルを挿入
    if (styleTag) {
      styleTag.innerHTML = `
        body::-webkit-scrollbar{
            display:none;
        }

        #photo {
            margin-top: 0;
            width: 100%;
            height: 100vh;
        }

        /*縦長*/
        @media screen and (orientation: portrait) {
            #photo {
                white-space: nowrap;
                scroll-snap-type: x mandatory;
                overflow-x: auto;
                overflow-y: hidden;
            }
        }

        /*横長*/
        @media screen and (orientation: landscape) {
            #photo {
                scroll-snap-type: y mandatory;
                overflow-x: hidden;
                overflow-y: auto;
            }

            footer {
                display: none;
            }
        }
        
        .eventGroup, .subGroup, .fileGroup, .inFile {
            display: contents; /*親要素を無効に*/
        }

        header, .frameBox, .subgroupName, .fileName {
            display: none;
        }

        .inFile img {
            width: 100%;
            max-width: none;
            height: 100%;
            aspect-ratio: unset;
            object-fit: contain;
            scroll-snap-align: start;
        }
      `;
    }

    // クリックした画像までスクロールを進める
    const landscape = window.matchMedia("(orientation: landscape)");; 
    const fileID = Number(event.target.id); // 上から数えて何枚目か
    if (landscape.matches) { // 横向き
      photo.scrollTo(0, window.innerHeight * fileID); // 100vh*枚数
    } else { // 縦向き
      photo.scrollTo(window.innerWidth * fileID, 0);// 100vw*枚数
    }
  } else {
    console.log("現在監視中のため、クリックは無視されます");
    const imageWidth = event.target.clientWidth;// 画像の表示幅をピクセル単位で取得
    fileDataUp.style.width =  `${imageWidth}px`;
    fileDataDown.style.width =  `${imageWidth}px`;
    // ファイル情報表示のアニメーション
    if (fileDataUp.classList.contains("active")) {
        fileDataUp.classList.remove("active");
        fileDataDown.classList.remove("active");
        fileDataUp.classList.add("closing");
        fileDataDown.classList.add("closing");

        // 前の setTimeout が残っていたらクリア
        clearTimeout(timeoutId);

        // 高さが縮むタイミングと同期させる
        timeoutId = setTimeout(() => {
          // closing クラスを削除
          fileDataUp.classList.remove("closing"); 
          fileDataDown.classList.remove("closing");
        }, 600); // height のアニメーション時間と合わせる
    } else {
        fileDataUp.classList.add("active");
        fileDataDown.classList.add("active");

        // 前の setTimeout をクリア
        clearTimeout(timeoutId);
    }
  }
}

// pictureLボタンのクリックで監視停止
pictureL.addEventListener('click', () => {
  if (isObserving) {
    observer.disconnect();
    isObserving = false;
    console.log("監視停止");
    fileDataUp.classList.remove("active","closing");
    fileDataDown.classList.remove("active","closing");
  }
  if (styleTag) {
    styleTag.innerHTML = '';
  }
  const moveElement = document.getElementById(currentID);
  moveElement.scrollIntoView();
  window.scrollBy(0, window.innerHeight * -0.47); // 47vh
});



// 画像が180pxのときに画像を中央に配置中央に配置
function setPadding() {
  // #photo 要素の幅（100%の幅）を取得
  const photoEl = document.querySelector('#photo');
  if (!photoEl) return;
  const photoWidth = photoEl.getBoundingClientRect().width;
  
  // 対象のチェック要素 (.photoes または .videoes) を取得
  const targetElement = document.querySelector('.photoes') || document.querySelector('.videoes');
  if (!targetElement) return;
  
  // 対象要素の実際の幅を取得
  const computedWidth = parseFloat(window.getComputedStyle(targetElement).width);
  
  // 全ての .inFile 要素を取得
  const inFileElements = document.querySelectorAll('.inFile');
  
  // 対象要素の幅が 180px の場合にのみ計算
  if (computedWidth === 180) {
    const remainder = photoWidth % 180;      // #photoの幅を180pxで割った余り
    const paddingLeft = remainder / 2;         // その半分の値
    inFileElements.forEach(el => {
      el.style.paddingLeft = paddingLeft + 'px';
    });
  } else {
    // 180px でない場合は、padding-left をクリア
    inFileElements.forEach(el => {
      el.style.paddingLeft = '';
    });
  }
}

// 初回実行
setPadding();

// ウィンドウリサイズ時に再計算
window.addEventListener('resize', setPadding);
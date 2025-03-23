// 画像レタリング後に実行

// head内のstyleタグを取得
const styleTag = document.querySelector('head style');
// pictuerLボタンを取得
const pictuerL = document.getElementById('pictuerL');

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
          const inFile = entry.target.closest(".inFile");
          const fileGroup = inFile.closest(".fileGroup");
          if (fileGroup != null) {
            const fileName = fileGroup.querySelector(".fileName");
            inFileName.textContent = fileName.textContent;
          } else {
            inFileName.textContent = "";
          }
           // subGroup
          const subGroup = inFile.closest(".subGroup");
          if (subGroup != null) {
            const subgroupName = subGroup.querySelector(".subgroupName");
            inSubGroup.textContent = subgroupName.textContent;
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

// 画像の onclick イベントで呼ばれる関数
function handleMediaClick() {
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

        #fileData {
            display: block;
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
  } else {
    console.log("現在監視中のため、クリックは無視されます");
  }
}

// pictuerLボタンのクリックで監視停止
pictuerL.addEventListener('click', () => {
  if (isObserving) {
    observer.disconnect();
    isObserving = false;
    console.log("監視停止");
  }
  if (styleTag) {
    styleTag.innerHTML = '';
  }
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
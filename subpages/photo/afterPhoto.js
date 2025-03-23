// 画像レタリング後に実行

// head内のstyleタグを取得
const styleTag = document.querySelector('head style');
// 監視対象の要素を取得
// グローバル変数と IntersectionObserver の定義
let isObserving = false;
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const src = entry.target.getAttribute('src');
      console.log("Source: " + src);
      // ここに他の処理を追加できます
      // 画像拡大表示用
      styleTag.innerHTML = `
        
      `;
    }
  });
});

// ページ内の監視対象の要素（img と video）を取得（※ここは初回読み込み時に一度だけ取得）
const mediaElements = document.querySelectorAll('#photo .eventGroup .inFile img, #photo .eventGroup .inFile video');

// 画像の onclick イベントで呼ばれる関数（画像側の onclick からこの関数を呼んでください）
function handleMediaClick() {
  if (!isObserving) {
    // まだ監視が開始されていない場合のみ、全対象を監視に登録
    mediaElements.forEach(el => observer.observe(el));
    isObserving = true;
    console.log("監視開始");
  } else {
    console.log("現在監視中のため、クリックは無視されます");
  }
}

// ボタン(#pictuerL)のクリックで監視停止
document.getElementById('pictuerL').addEventListener('click', () => {
  if (isObserving) {
    observer.disconnect();
    isObserving = false;
    console.log("監視停止");
  }
  if (styleTag) {
    // styleタグの中身を消す
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
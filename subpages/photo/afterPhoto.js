// 画像レタリング後に実行

// 監視対象の要素を取得
var mediaElements = document.querySelectorAll('#photo .eventGroup .inFile img, #photo .eventGroup .inFile video');

// IntersectionObserverのコールバック関数を定義
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            var src = entry.target.getAttribute('src');
            console.log("Source: " + src);
            // ここに他の処理を追加できます
        }
    });
}

// IntersectionObserverを作成
var observer = new IntersectionObserver(handleIntersection);

// すべての監視対象の要素を登録
mediaElements.forEach(element => observer.observe(element));


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
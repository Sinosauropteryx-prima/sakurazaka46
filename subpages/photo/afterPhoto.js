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
  const vw = window.innerWidth; // 現在のウィンドウ幅(px)
    
  // チェック対象の要素（.photoes または .videoes のどちらかが存在すればOK）
  const targetElement = document.querySelector('.photoes') || document.querySelector('.videoes');
    
  if (!targetElement) return;
    
  // 対象要素の実際の幅を取得
  const computedWidth = parseFloat(window.getComputedStyle(targetElement).width);
    
  // 全ての .inFile 要素を取得
  const inFileElements = document.querySelectorAll('.inFile');
    
  // 対象要素の幅が180pxの場合のみ計算
  if (computedWidth === 180) {
    const remainder = vw % 180;      // 100vw(px)を180pxで割った余り
    const paddingLeft = remainder / 2; // その余りの半分
    inFileElements.forEach(el => {
      el.style.paddingLeft = paddingLeft + 'px';
    });
  } else {
    // 180pxでない場合は、padding-leftの設定をクリア
    inFileElements.forEach(el => {
      el.style.paddingLeft = '';
    });
  }
}
  
// 初回実行
setPadding();
  
// ウィンドウリサイズ時に再計算
window.addEventListener('resize', setPadding);
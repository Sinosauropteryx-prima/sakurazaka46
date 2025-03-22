// 画質のよい画像を表示するためのコード
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
fetch("https://sinosauropteryx-prima.github.io/sakurazaka46/common/header.html")
  .then((response) => response.text())
  .then((data) => {
    // ヘッダーを挿入
    document.querySelector("body").insertAdjacentHTML('afterbegin', data);
    
    // 現在のファイル名を取得し、デコードする
    const encodedFileName = window.location.pathname.split('/').pop();
    const currentFileName = decodeURIComponent(encodedFileName);
    console.log("現在のファイル名:", currentFileName);

    // ファイル名が櫻坂46.htmlの場合にのみhref属性を修正
    if (currentFileName === '櫻坂46.html') {
      const headerLinks = document.querySelectorAll('header a');
      console.log("対象となるリンク数:", headerLinks.length);
      headerLinks.forEach(link => {
        let href = link.getAttribute('href');
        console.log("元のhref:", href);
        if (href && href.startsWith('../')) {
          href = href.replace('../', '');
          link.setAttribute('href', href);
          console.log("修正後のhref:", href);
        }
      });
    } else {
      console.log("ファイル名が櫻坂46.htmlではないので、修正は行いません");
    }
  })
  .catch(err => {
    console.error("ヘッダーの読み込みエラー:", err);
  });



fetch("https://sinosauropteryx-prima.github.io/sakurazaka46/common/footer.html")
    .then((response) => response.text())
    .then((data) => document.querySelector("body").insertAdjacentHTML('beforeend', data));
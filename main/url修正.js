// header内のすべてのaタグを取得
const headerLinks = document.querySelectorAll('header a');

headerLinks.forEach(link => {
  // href属性を取得
  let href = link.getAttribute('href');
  
  // 最初の../を削除
  if (href.startsWith('../')) {
    href = href.replace('../', '');
    link.setAttribute('href', href);
  }
});
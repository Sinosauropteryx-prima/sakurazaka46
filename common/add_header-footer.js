fetch("header.html")
    .then((response) => response.text())
    .then((data) => document.querySelector(".body").insertAdjacentHTML('afterbegin', data));

fetch("footer.html")
    .then((response) => response.text())
    .then((data) => document.querySelector(".body").insertAdjacentHTML('beforeend', data));
fetch("https://sinosauropteryx-prima.github.io/sakurazaka46/common/header.html")
    .then((response) => response.text())
    .then((data) => document.querySelector("body").insertAdjacentHTML('afterbegin', data));

fetch("https://sinosauropteryx-prima.github.io/sakurazaka46/common/footer.html")
    .then((response) => response.text())
    .then((data) => document.querySelector("body").insertAdjacentHTML('beforeend', data));
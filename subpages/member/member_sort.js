function loadScripts() {
    const script1 = document.createElement('script');
    script1.src = 'sort/sort.js';  // sort.jsのパスを指定
    script1.onload = function() {
        const script2 = document.createElement('script');
        script2.src = 'sort/tablesorter.js';  // tablesorter.jsのパスを指定
        document.body.appendChild(script2);
    };
    document.body.appendChild(script1);
}

function age(bymd){
    today=new Date();
    ty=today.getYear(); if(ty<1900) ty+=1900;
    tm=today.getMonth()+1;
    td=today.getDate();
    tymd=ty*10000+tm*100+td;
    return Math.floor((tymd-bymd)/10000);
}

$(function(){
    $('.check').on('click', function() {
        if ($(this).prop('checked')){
            // 一旦全てをクリアして再チェックする
            $('.check').prop('checked', false);
            $(this).prop('checked', true);
        }
    });
});

$(function(){
    $('.check1').on('click', function() {
        if ($(this).prop('checked')){
            // 一旦全てをクリアして再チェックする
            $('.check1').prop('checked', false);
            $(this).prop('checked', true);
        }
    });
});

const CSV_URL = "https://sinosauropteryx-prima.github.io/sakurazaka46/subpages/member/member.csv";

async function loadCSV() {
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const csvText = await response.text();
        displayCSV(csvText);
    } catch (error) {
        alert("CSVの読み込みに失敗しました: " + error.message);
    }
}

function displayCSV(csvText) {
    const rows = csvText.split("\n").map(row => row.split(","));
    const table = document.getElementById("myTable");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    // menuクラスを持つul要素を取得
    const menu = document.querySelector(".menu");
    thead.innerHTML = "";
    tbody.innerHTML = "";
    // 既存のstyleタグを取得（最初のstyleタグを取得）
    const style = document.querySelector("style");

    // 1行目をヘッダーとして表示
    const headers = rows[0];

    // 2行目をクラス名として利用
    const classNames = rows[1];

    // '['が現れたら1にする（[1st single]などの判定）
    let kadocheck = 0;

    // ul(menu)内に挿入する
    let detailsHTML = `<details>`;

    // style内に挿入する
    // display:none;
    let noneStyle = `
        #現役:checked ~ table tbody tr:has(td.卒業日-済),#現役:checked ~ .menu li #現役-ダミー,
        #卒業:checked ~ table tbody tr:has(td.卒業日),#卒業:checked ~ .menu li #卒業-ダミー,`;
    
    // display:inline-block;
    let inlineStyle = `
        #現役:checked ~ .menu li #現役-ダミー1,
        #卒業:checked ~ .menu li #卒業-ダミー1,`;

    // ヘッダー行を作成
    const headerRow = document.createElement("tr");
    headers.forEach((header, index) => {
        const th = document.createElement("th");
        th.textContent = header.trim();

        // 初めて1文字目に'['が登場した場合
        if (header.trim().charAt(0) === '[' && kadocheck === 0) {
            kadocheck = 1;
            detailsHTML += `<summary class="cdcount">${header.trim().replace(/^\[|\]$/g, '')}</summary>`;
        } else if (kadocheck === 1 && header.trim().charAt(0) != '[' && headers.length-1 != index) { // '['が登場した後（特定のsingle,album内）
            detailsHTML += `
                <li>
                    <input id="${classNames[index].trim()}-ダミー" type="checkbox">
                    <input id="${classNames[index].trim()}-ダミー1" class="ダミー1" type="checkbox" checked>
                    <label for="${classNames[index].trim()}">${header.trim()}</label>
                </li>`;

            // table上部に挿入するinput要素(checkbox)を作成
            const inputElement = document.createElement("input");
            inputElement.id = classNames[index].trim();
            inputElement.className = "checkbox";
            inputElement.type = "checkbox";
            // tableの直前にinputを挿入
            table.insertAdjacentElement("beforebegin", inputElement);

            noneStyle += `#${classNames[index].trim()}:checked ~ table tbody tr:has(td.${classNames[index].trim()}-not),#${classNames[index].trim()}:checked ~ .menu li #${classNames[index].trim()}-ダミー,`;
            inlineStyle += `#${classNames[index].trim()}:checked ~ .menu li #${classNames[index].trim()}-ダミー1,`;
        } else if (kadocheck === 1 && header.trim().charAt(0) === '[') { // 2回目以降に'['が登場（特定のsingle,albumが終わり、次のsingle）
            detailsHTML += `</details>`;
            // details を ul の終わりに挿入
            menu.insertAdjacentHTML("beforeend", detailsHTML);
            detailsHTML = `
                <details>
                    <summary class="cdcount">${header.trim().replace(/^\[|\]$/g, '')}</summary>`;
        } else if (headers.length-1 === index) { // 最後の楽曲
            detailsHTML += `
                    <li>
                        <input id="${classNames[index].trim()}-ダミー" type="checkbox">
                        <input id="${classNames[index].trim()}-ダミー1" class="ダミー1" type="checkbox" checked>
                        <label for="${classNames[index].trim()}">${header.trim()}</label>
                    </li>
                </details>`;
            // details を ul の終わりに挿入
            menu.insertAdjacentHTML("beforeend", detailsHTML);

            // table上部に挿入するinput要素(checkbox)を作成
            const inputElement = document.createElement("input");
            inputElement.id = classNames[index].trim();
            inputElement.className = "checkbox";
            inputElement.type = "checkbox";
            // tableの直前にinputを挿入
            table.insertAdjacentElement("beforebegin", inputElement);

            noneStyle += `#${classNames[index].trim()}:checked ~ table tbody tr:has(td.${classNames[index].trim()}-not),#${classNames[index].trim()}:checked ~ .menu li #${classNames[index].trim()}-ダミー,`;
            inlineStyle += `#${classNames[index].trim()}:checked ~ .menu li #${classNames[index].trim()}-ダミー1,`;
        }
        

        // 1行目の1列目にはfixed1、それ以外にはfixedを追加
        if (index === 0) {
            th.classList.add('fixed1');
        } else {
            th.classList.add('fixed');
        }

        // 2行目の内容をクラス名として適用
        if (classNames[index]) {
            th.classList.add(classNames[index].trim());
        }

        // ふりがな、都道府県番号、1文字目が'['の場合の列は非表示
        if (index != 1 && index != 8 && header.trim().charAt(0) != '[') { 
            headerRow.appendChild(th);
        }
    });
    thead.appendChild(headerRow);

    // 加入期（重複無し）で格納
    const jointerm = [];

    // 特別な理由（休養などを重複無し）
    const reasons = [];

    // 2行目以降のデータを表示
    rows.slice(2).forEach((row) => {
        const tr = document.createElement("tr");
        
        // 曲名に入ったかどうか
        let insong = 0;

        row.forEach((cell, index) => {
            const td = document.createElement("td");
            let content = cell.trim();

            if (content === "ー") {
                td.classList.add(classNames[index].trim() + "-not", "notjoin");
                content = "";
            } else if (content === "" && index != 3) {// 卒業日の列でない
                td.classList.add(classNames[index].trim() + "-not", "no");
                content = "ー";
            } else if (index != 3) {// 卒業日の列でない
                td.classList.add(classNames[index].trim());
            }

            // 特別な理由を格納
            if (cell.charAt(0) == '[') {
                insong = 1;
            } else if (content != "ー" && content != "〇" && content != "C" && content != "Ⅰ" && content != "Ⅱ" && content != "Ⅲ" && content != "" && insong == 1) {
                td.className = "";
                td.classList.add(classNames[index].trim() + "-not", content, "result");
                if (!reasons.includes(content)) { // 重複してないか
                    reasons.push(content);
                }
                content = "";
            }

            if (index === 0) {
                const ruby = document.createElement("p");
                ruby.classList.add("ruby");
                ruby.textContent = row[1]; // 2列目をふりがなとして表示
                td.appendChild(ruby);
                td.appendChild(document.createTextNode(content)); // 名前を表示
                td.classList.add('fixed');
            } else if (index === 3) {
                if (content === "") {
                    td.classList.add(classNames[index].trim());
                } else {
                    td.classList.add(classNames[index].trim() + "-済");
                    td.textContent = content;
                }
            } else if (index === 4){
                let reverseTerm = "期" + content.match(/\d+/); // 1期->期1
                td.classList.add(reverseTerm);
                if (!jointerm.includes(reverseTerm)) { // 何期あるかを保存
                    jointerm.push(reverseTerm);
                }
                td.textContent = content;
            } else if (index === 6) {
                td.textContent = age(content); // 年齢を表示
            } else if (index === 7) {
                const ruby = document.createElement("p");
                ruby.classList.add("ruby");
                ruby.textContent = row[8]; // 9列目を都道府県番号として表示
                td.appendChild(ruby);
                td.appendChild(document.createTextNode(content)); // 出身地を表示
            } else {
                td.textContent = content;
            }
            
            if (index != 1 && index != 8 && content.charAt(0) != '[') { // ふりがな、都道府県番号、1文字目が'['の場合の列は非表示
                tr.appendChild(td);
            }
        });

        if (row[0] != "") { // 名前が描かれていれば行を挿入
            tbody.appendChild(tr);
        }
    });

    // 特別な理由をクラス名としたcssを適応
    reasons.forEach((item, index) => {
        // CSSを追加
        style.textContent += `
            .${item}::after{
                content: "${item}";
            }`;
    });

    // <li class="top"></li>を取得
    const litop = document.querySelector('.top');

    // .topの中身
    let topContent = "";

    // 期に関するinputを挿入
    jointerm.forEach((item, index) => {
        // .期2,.期3…を保持する
        let term = "";
        // 1つ目かどうか
        let first = 0;
        // 現在のitem以外の期
        jointerm.forEach((notitem, notindex) => {
            if (index != notindex) {
                if (first == 0) {
                    term += `.${notitem}`;
                    first = 1;
                } else {
                    term += `,.${notitem}`;
                }
            }
        });

        // 最後の期ならば
        if (jointerm.length-1 == index) {
            topContent += `
                <input id="${item}-ダミー" type="checkbox">
                <input id="${item}-ダミー1" class="ダミー1" type="checkbox" checked>
                <label for="${item}">${item.match(/\d+/)}期</label>`;
            // .topの中身を追加
            litop.innerHTML = topContent;

            noneStyle += `
                #${item}:checked ~ table tbody tr:has(td${term}),#${item}:checked ~ .menu li #${item}-ダミー{
                    display: none;
                }`;
            // CSSを追加
            style.textContent += noneStyle;

            inlineStyle += `
                #${item}:checked ~ .menu li #${item}-ダミー1{
                    display: inline-block;
                }`;
            // CSSを追加
            style.textContent += inlineStyle;
        } else {
            topContent += `
                <input id="${item}-ダミー" type="checkbox">
                <input id="${item}-ダミー1" class="ダミー1" type="checkbox" checked>
                <label for="${item}">${item.match(/\d+/)}期</label>`;

            noneStyle += `#${item}:checked ~ table tbody tr:has(td${term}),#${item}:checked ~ .menu li #${item}-ダミー,`;
            inlineStyle += `#${item}:checked ~ .menu li #${item}-ダミー1,`;
        }

        // table上部に挿入するinput要素(checkbox)を作成
        const inputElement = document.createElement("input");
            inputElement.id = item;
            inputElement.className = "checkbox check";
            inputElement.type = "checkbox";
            // tableの直前にinputを挿入
            table.insertAdjacentElement("beforebegin", inputElement);
    });

    // CSV表示後にsort.jsとtablesorter.jsを読み込む処理
    loadScripts();
}
// ページが読み込まれたら自動でCSVを取得
window.onload = loadCSV;
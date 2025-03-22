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

const CSV_URL = "https://sinosauropteryx-prima.github.io/sakurazaka46/subpages/photo/photo.csv"; // 後で変更

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
    const photo = document.getElementById("photo");

    // 画像のベースパス
    const basepath = "photo/pictures";
    
    // 既存のstyleタグを取得（最初のstyleタグを取得）
    const style = document.querySelector("style");

    // csv1行目
    const headers = rows[0];

    // csv2行目をクラス名として利用
    const classNames = rows[1];

    // csv1行目
    // メンバー名の配列を作成
    let memberChk = 0; // メンバー列に入ったら1
    const member = []; // メンバー名(オブジェクト配列)
    headers.forEach((header, index) => {
        if(index == 10) {
            memberChk = 1;
        }
        if (memberChk == 1) {
            let newObject = {
                name: header,
                className: classNames[index]
            };
            member.push(newObject);
        }
    });

    // eventGroupのインデックス
    let eGindex = -1;

    // 画像の拡張子
    let photoExt = ["jpg","jpeg","png","gif","bmp"];

    // 動画の拡張子
    let movieExt = ["mp4","mov","avi","wmv"];

    // ファイル固有の番号
    let fileIndex = -1;
    // 3行目以降のデータを表示
    rows.slice(2).forEach((row,rowNumber) => {
        // 1行前のデータ
        function beforeData(column) {
            return rows[rowNumber+1][column].trim();
        };

        if (row[0] != beforeData(0)) { // イベント名がcsvの上の行と異なるときに作る
            // divタグを生成
            const div = document.createElement("div");
            div.classList.add("eventGroup");
            eGindex++;
            photo.appendChild(div);
        }
        // ファイルパス
        let filePath = basepath;

        // ファイル数
        let fileNumbers = 0;

        row.forEach((cell, index) => {
            const p = document.createElement("p");
            let content = cell.trim();

            // 挿入する場所を取得
            const eventGroup = document.getElementsByClassName("eventGroup")[eGindex];

            if (index === 0 && content != beforeData(0)) { // イベント名 && イベント名がcsvの上の行と異なる場合
                p.textContent = content;
                p.classList.add("eventName");
                eventGroup.appendChild(p);
            } else if (index === 1) { // イベントのフォルダ名
                filePath = filePath + "/" + content;
            } else if (index === 2 && row[0].trim() != beforeData(0)){ // イベント開始日 && イベント名がcsvの上の行と異なる場合
                p.textContent = content;
                p.classList.add("startDate");
                eventGroup.appendChild(p);
            } else if (index === 4 && ((row[0].trim() != content && beforeData(4) != content) || row[0].trim() != beforeData(0))) { // サブグループ名 && ((イベント名と異なる && サブグループ名がcsvの上の行と異なる) || イベント名がcsvの上の行と異なる)
                p.textContent = content;
                p.classList.add("subgroup");
                eventGroup.appendChild(p);
            } else if (index === 5) { // サブグループのフォルダ名
                filePath = filePath + "/" + content;
            } else if (index === 6) { // ファイル名[枚数]
                // 正規表現を使って、角括弧の前の部分と数字を取得する
                let match = content.match(/^(.+?)\[(\d+)\]/);

                // それぞれキャプチャグループから値を抽出
                let fileName = match ? match[1] : null;
                fileNumbers = match ? match[2] : null;

                if (fileName != row[4]) { // サブグループ名と異なる
                    p.textContent = content;
                    p.classList.add("fileName");
                    eventGroup.appendChild(p);
                }
            } else if (index == 7) { // ファイル名
                filePath = filePath + "/" + content;
                // ファイル格納のdiv
                const inFile = document.createElement("div");
                inFile.classList.add("inFile");
                // 拡張子
                const extension = row[8].trim();

                if (photoExt.includes(extension)) { // 画像ファイル
                    for(let i=1; i<=fileNumbers; i++) {
                        // imgタグを生成
                        const img = document.createElement("img");
                        img.src = `${filePath}(${i}).${extension}`;
                        img.classList.add("photoes");
                        img.setAttribute("loading","lazy");
                        inFile.appendChild(img);
                    }
                } else if (movieExt.includes(extension)) { // 動画ファイル
                    // videoタグを生成
                    const video = document.createElement("video");
                    video.src = `${filePath}(${i}).${extension}`;
                    video.classList.add("videoes");
                    inFile.appendChild(video);
                }
                eventGroup.appendChild(inFile);
            }
        });
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
function loadScripts() {
    const script1 = document.createElement('script');
    script1.src = 'photo/afterPhoto.js';  // afterPhoto.jsのパスを指定
    document.body.appendChild(script1);
}

// 要素のsrcを取得
function getSrc(mediaElement) {
    let src = mediaElement.getAttribute('src');
    let newSrc = src.replace(/\/圧縮\//g, "/");
    
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

    // subGroupのインデックス
    let sGindex = -1;

    // fileGroupのインデックス
    let fGindex = -1;

    // 現在の挿入場所ー0=>eventGroup,1=>subGroup,2=>fileGroup
    let currentIndex = 0;

    // 画像の拡張子
    let photoExt = ["jpg","jpeg","png","gif","bmp"];

    // 動画の拡張子
    let movieExt = ["mp4","mov","avi","wmv"];

    // ファイル固有の番号
    let fileIndex = 0;

    // 3行目以降のデータを表示
    rows.slice(2).forEach((row,rowNumber) => {
        // 1行前のデータ
        function beforeData(column) {
            return rows[rowNumber+1][column].trim();
        };

        if (row[0] == "") { // イベント名が空欄（つまり空欄の行）ならば
            return; // 処理をスキップ
        }

        // ファイルパス
        let filePath = basepath;

        // ファイル数
        let fileNumbers = 0;

        // 囲み枠
        let frameBox;

        row.forEach((cell, index) => {
            const div = document.createElement("div");
            const p = document.createElement("p");
            let content = cell.trim();
            let currentGroup = 0;

            // 挿入する場所を取得
            if (currentIndex === 0) {
                currentGroup = document.getElementsByClassName("eventGroup")[eGindex];
            } else if (currentIndex === 1) {
                currentGroup = document.getElementsByClassName("subGroup")[sGindex];
            } else if (currentIndex === 2) {
                currentGroup = document.getElementsByClassName("fileGroup")[fGindex];
            }
            

            if (index === 0 && content != beforeData(0)) { // イベント名 && イベント名がcsvの上の行と異なる場合
                // divタグを生成
                div.classList.add("eventGroup");
                eGindex++;
                photo.appendChild(div);
                // 囲み枠作成
                frameBox = document.createElement("div");
                frameBox.classList.add("frameBox");
                div.appendChild(frameBox);
                // イベント名表示
                p.textContent = content;
                p.classList.add("eventName");
                frameBox.appendChild(p);
                // 現在の挿入場所
                currentIndex = 0;
            } else if (index === 1) { // イベントのフォルダ名
                filePath = filePath + "/" + content;
            } else if (index === 2 && row[0].trim() != beforeData(0)){ // イベント開始日 && イベント名がcsvの上の行と異なる場合
                p.textContent = content + "～";
                p.classList.add("startDate","Date");
                frameBox.appendChild(p);
            } else if (index === 4 && row[0].trim() != content) { // サブグループ名 && イベント名と異なる
                if (beforeData(4) != content || row[0].trim() != beforeData(0)) { //サブグループ名がcsvの上の行と異なる || イベント名がcsvの上の行と異なる
                    // divタグを生成
                    div.classList.add("subGroup");
                    sGindex++;
                    currentGroup.appendChild(div);
                    // サブグループ名表示
                    p.textContent = content;
                    p.classList.add("subgroupName");
                    div.appendChild(p);
                }
                // 現在の挿入場所
                currentIndex = 1;
            } else if (index === 5) { // サブグループのフォルダ名
                filePath = filePath + "/" + content;
            } else if (index === 6) { // ファイル名[枚数]
                // 正規表現を使って、角括弧の前の部分と数字を取得する
                let match = content.match(/^(.+?)\[(\d+)\]/);

                // それぞれキャプチャグループから値を抽出
                let fileName = match ? match[1] : null;
                fileNumbers = match ? match[2] : null;

                if (fileName != row[4]) { // サブグループ名と異なる
                    // divタグを生成
                    div.classList.add("fileGroup");
                    fGindex++;
                    currentGroup.appendChild(div);
                    // ファイル名表示
                    p.textContent = fileName;
                    p.classList.add("fileName");
                    div.appendChild(p);
                    // 現在の挿入場所
                    currentIndex = 2;
                }
            } else if (index == 7) { // ファイル名
                filePath = filePath + "/圧縮/" + content;
                // ファイル格納のdiv
                const inFile = document.createElement("div");
                inFile.classList.add("inFile");
                currentGroup.appendChild(inFile);
                // 拡張子
                const extension = row[8].trim();

                if (photoExt.includes(extension)) { // 画像ファイル
                    for(let i=1; i<=fileNumbers; i++) {
                        // imgタグを生成
                        const img = document.createElement("img");
                        img.src = `${filePath}(${i}).${extension}`;
                        img.classList.add("photoes");
                        img.id = fileIndex;
                        img.setAttribute("loading","lazy");
                        img.setAttribute("onclick","handleMediaClick(event)");
                        inFile.appendChild(img);
                        fileIndex++;
                    }
                } else if (movieExt.includes(extension)) { // 動画ファイル
                    for(let i=1; i<=fileNumbers; i++) {
                        // videoタグを生成
                        const video = document.createElement("video");
                        video.src = `${filePath}(${i}).${extension}`;
                        video.classList.add("videoes");
                        video.id = fileIndex;
                        inFile.appendChild(video);
                        fileIndex++;
                    }
                }
                // 現在の挿入場所
                currentIndex = 0;
            }
        });
    });

    // CSV表示後にsort.jsとtablesorter.jsを読み込む処理
    loadScripts();
}
// ページが読み込まれたら自動でCSVを取得
window.onload = loadCSV;
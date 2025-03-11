// 要素の全取得
const months = [...document.querySelectorAll('.month1')];

// テキストを取得
const get_daily_text = daily => daily.querySelector('p').textContent.toLowerCase();

// 全角スペースを半角スペースに変換
const to_half_space = str => str.replace(/　/g, ' ');

// 含まれるかのテスト関数
const check = (text, values) => values.every(xi => text.includes(xi));

// inputイベントで処理を行う
input.addEventListener('input', function onInput (event) {
  search_dialy(this.value);
}, false);

// 検索ワードの変更
function news () {
  input.value = '#news';
  search_dialy(input.value);
}

function media () {
  input.value = '#media';
  search_dialy(input.value);
}

function tv () {
  input.value = '#tv';
  search_dialy(input.value);
}

function release () {
  input.value = '#release';
  search_dialy(input.value);
}

function event1 () {
  input.value = '#event';
  search_dialy(input.value);
}

// 日記の検索処理
function search_dialy (value) {
  const values = to_half_space(value).split(' ');
  let dailies, not_found;
  months.forEach(month => {
    // month1内のdailyを取得
    dailies = [...month.querySelectorAll('.daily')];

    // 全てのdailyにinputのテキストが含まれていないことを判定、表示設定
    not_found = dailies.map(daily => to_half_space(get_daily_text(daily)))
        .every(text => !check(text, values));
    month.style.display = not_found? 'none': 'block';

    // 見付からない場合にはmonth自体のdisplayをnoneにして抜ける
    if (not_found) return;

    // dailyのテキストに応じたdisplayの変更処理
    dailies.map(daily => [daily, get_daily_text(daily)])
        .forEach(([daily, text]) => {
      daily.style.display = check(text, values)? 'block': 'none';
    });
  });
}


(function(){

  //要素の取得
  var elements = document.getElementsByClassName("mini");

  //要素内のクリックされた位置を取得するグローバル（のような）変数
  var x;
  var y;

  //マウスが要素内で押されたとき、又はタッチされたとき発火
  for(var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("mousedown", mdown, false);
      elements[i].addEventListener("touchstart", mdown, false);
  }

  //マウスが押された際の関数
  function mdown(e) {

      //クラス名に .drag を追加
      this.classList.add("drag");

      //タッチデイベントとマウスのイベントの差異を吸収
      if(e.type === "mousedown") {
          var event = e;
      } else {
          var event = e.changedTouches[0];
      }

      //要素内の相対座標を取得
      x = event.pageX - this.offsetLeft;
      y = event.pageY - this.offsetTop;

      //ムーブイベントにコールバック
      document.body.addEventListener("mousemove", mmove, false);
      document.body.addEventListener("touchmove", mmove, false);
  }

  //マウスカーソルが動いたときに発火
  function mmove(e) {

      //ドラッグしている要素を取得
      var drag = document.getElementsByClassName("drag")[0];

      //同様にマウスとタッチの差異を吸収
      if(e.type === "mousemove") {
          var event = e;
      } else {
          var event = e.changedTouches[0];
      }

      //フリックしたときに画面を動かさないようにデフォルト動作を抑制
      e.preventDefault();

      //マウスが動いた場所に要素を動かす
      drag.style.top = event.pageY - y + "px";
      drag.style.left = event.pageX - x + "px";

      //マウスボタンが離されたとき、またはカーソルが外れたとき発火
      drag.addEventListener("mouseup", mup, false);
      document.body.addEventListener("mouseleave", mup, false);
      drag.addEventListener("touchend", mup, false);
      document.body.addEventListener("touchleave", mup, false);

  }

  //マウスボタンが上がったら発火
  function mup(e) {
      var drag = document.getElementsByClassName("drag")[0];

      //ムーブベントハンドラの消去
      document.body.removeEventListener("mousemove", mmove, false);
      drag.removeEventListener("mouseup", mup, false);
      document.body.removeEventListener("touchmove", mmove, false);
      drag.removeEventListener("touchend", mup, false);

      //クラス名 .drag も消す
      drag.classList.remove("drag");
  }

})()
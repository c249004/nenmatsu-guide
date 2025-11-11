// ============================================
// 基礎控除申告書ガイド用スクリプト
// （kiso_hints.json を読み込み、ヒントエリアと吹き出しを制御）
// ============================================

async function loadHints() {
  // 🔹 kiso_hints.json からガイド情報を取得
  const response = await fetch('kiso_hints.json');
  const hints = await response.json();

  // 🔹 ヒントエリアを表示するコンテナと、マウスオーバー時のツールチップを取得
  const container = document.getElementById('form-container');
  const tooltip = document.getElementById('tooltip');

  // 🔹 現在動作中の文字アニメーションを記録しておく変数
  let typingInterval = null;

  /**
 * 💬 吹き出し内に文字を1文字ずつ表示する関数（タイプアニメーション付き）
 * 
 * @param {HTMLElement} element - 文字を表示する要素（例: #guide-speech）
 * @param {string} text - 表示したいメッセージ（\nで改行可）
 * @param {number} speed - 1文字ずつ出す速さ（ミリ秒単位、デフォルト30ms）
 */
function typeText(element, text, speed = 30) {
  // ⛔ 前回のタイプアニメーションが動いていたら一度リセット
  if (typingInterval) clearInterval(typingInterval);

  // 💡 innerHTMLを使うことで <br>（改行タグ）を表示できるようにする
  element.innerHTML = '';

  // 🔢 現在どこまで文字を出したかを記録するためのカウンタ
  let i = 0;

  // ⏱️ 一定間隔ごとに文字を1つずつ増やしていく
  typingInterval = setInterval(() => {
    // 🧩 0文字目からi文字目までを取得して表示
    // 🌀 さらに \n を <br> に置き換えて、改行を反映
    const displayText = text.substring(0, i).replace(/\n/g, '<br>');
    element.innerHTML = displayText;

    // ➕ 次の文字へ進む
    i++;

    // ✅ 全部表示し終えたらアニメーションを終了
    if (i > text.length) {
      clearInterval(typingInterval);
      typingInterval = null; // 状態リセット
    }
  }, speed);
}


  // 🔹 kiso_hints.json にある各ヒント領域を順番に処理
  hints.forEach((item, index) => {
    // 💠 ヒント領域（透明な当たり判定エリア）を作る
    const area = document.createElement('div');
    area.classList.add('hint-area');

    // 💠 座標とサイズをJSONの設定値から反映
    // 🔸 JSONのキーが top / left / width / height になっている点に注意
    if (
      typeof item.top !== 'number' ||
      typeof item.left !== 'number' ||
      typeof item.width !== 'number' ||
      typeof item.height !== 'number'
    ) {
      console.warn('hint の座標が不正です: Object index:', index);
      return; // スキップ
    }

    area.style.top = item.top + 'px';
    area.style.left = item.left + 'px';
    area.style.width = item.width + 'px';
    area.style.height = item.height + 'px';

    // 🖱️ マウスがエリアに入ったときの処理
    area.addEventListener('mouseover', e => {
      // 🔸 tooltip（マウスの横に出る小さな説明）を表示
      tooltip.textContent = item.hint;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY + 10) + 'px';

      // 🔸 画面下のガイド吹き出し（#guide-speech）に文字を流す
      const speech = document.getElementById('guide-speech');
      if (speech) {
        // 💬 typeText()で1文字ずつ表示するアニメーション開始
        typeText(speech, item.hint, 40);
      }
    });

    // 🖱️ マウスを動かしたとき → tooltip の位置を追随させる
    area.addEventListener('mousemove', e => {
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY + 10) + 'px';
    });

    // 🖱️ マウスがエリアから出たら tooltip を非表示にする
    area.addEventListener('mouseout', () => {
      tooltip.style.display = 'none';
    });

    // 🧩 コンテナにこのヒントエリアを追加
    container.appendChild(area);
  });
}

// 🚀 ページ読み込み時に実行
loadHints();

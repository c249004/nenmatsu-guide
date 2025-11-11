async function loadHints() {
  const response = await fetch('fuyou_hints.json');
  const hints = await response.json();

  const container = document.getElementById('form-container');
  const tooltip = document.getElementById('tooltip');
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
  // 🌼 guide-note（補足）を取得
  const note = document.querySelector('.guide-note');
  if (note) note.style.opacity = '0.4'; // タイピング中は半透明にする

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
      if (note) note.style.opacity = '1'; // 💫 終わったら元に戻す
    }
  }, speed);
}



  hints.forEach(item => {
    const area = document.createElement('div');
    area.classList.add('hint-area');
    area.style.top = item.top + 'px';
    area.style.left = item.left + 'px';
    area.style.width = item.width + 'px';
    area.style.height = item.height + 'px';

    area.addEventListener('mouseover', e => {
      tooltip.textContent = item.hint;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY + 10) + 'px';
      const speech = document.getElementById('guide-speech');
      if (speech) typeText(speech, item.hint, 40);
    });

    area.addEventListener('mousemove', e => {
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY + 10) + 'px';
    });

    area.addEventListener('mouseout', () => {
      tooltip.style.display = 'none';
    });

    container.appendChild(area);
  });
}

loadHints();

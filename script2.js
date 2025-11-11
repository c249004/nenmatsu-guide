async function loadHints() {
  const response = await fetch('hints.json');
  const hints = await response.json();

  const container = document.getElementById('form-container');
  const tooltip = document.getElementById('tooltip');

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
area.addEventListener('mouseover', e => {
  tooltip.textContent = item.hint;
  tooltip.style.display = 'block';
  tooltip.style.left = (e.pageX + 10) + 'px';
  tooltip.style.top = (e.pageY + 10) + 'px';

  // 💬ガイドキャラの吹き出しにも反映
  document.getElementById('guide-speech').textContent = item.hint;
});
}


loadHints();

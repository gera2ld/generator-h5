let support;

function initSupport() {
  if (support) return;
  const div = document.createElement('div');
  div.setAttribute('style', 'font-size:1vw');
  const vw = div.style.fontSize === '1vw';
  support = { vw };
}

export function scaleWidth(stdWidth = 750, basePx = 100) {
  initSupport();
  onResize();
  if (!support.vw) window.addEventListener('resize', onResize, false);

  function onResize() {
    const docEl = document.documentElement;
    let fontSize;
    if (support.vw) {
      fontSize = `${basePx / stdWidth * 100}vw`;
    } else {
      fontSize = `${docEl.clientWidth / stdWidth * basePx}px`;
    }
    docEl.style.fontSize = fontSize;
  }
}

export function scaleHeight(stdHeight = 750, basePx = 100) {
  initSupport();
  onResize();
  if (!support.vw) window.addEventListener('resize', onResize, false);

  function onResize() {
    const docEl = document.documentElement;
    let fontSize;
    if (support.vw) {
      fontSize = `${basePx / stdHeight * 100}vh`;
    } else {
      fontSize = `${docEl.clientHeight / stdHeight * basePx}px`;
    }
    docEl.style.fontSize = fontSize;
  }
}

let support;

function initSupport() {
  if (support) return;
  const div = document.createElement('div');
  div.setAttribute('style', 'font-size:1vw');
  const vw = div.style.fontSize === '1vw';
  support = { vw };
}

export function scaleWidth(options) {
  initSupport();
  const {
    stdWidth = 750,
    basePx = 100,
    maxWidth = 768,
    resize = !support.vw,
  } = options || {};
  onResize();
  if (resize) window.addEventListener('resize', onResize, false);

  function onResize() {
    const docEl = document.documentElement;
    const { clientWidth } = docEl;
    let fontSize;
    if (maxWidth && clientWidth > maxWidth) {
      fontSize = `${maxWidth / stdWidth * basePx}px`;
    } else if (support.vw) {
      fontSize = `${basePx / stdWidth * 100}vw`;
    } else {
      fontSize = `${clientWidth / stdWidth * basePx}px`;
    }
    docEl.style.fontSize = fontSize;
  }
}

export function scaleHeight(options) {
  initSupport();
  const {
    stdHeight = 750,
    basePx = 100,
    resize = !support.vw,
  } = options || {};
  onResize();
  if (resize) window.addEventListener('resize', onResize, false);

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

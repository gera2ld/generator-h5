const requireHTML = require.context('.', true, /\/index.html$/);
const htmlFiles = requireHTML.keys().sort();
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  console.log([
    'Load sections:',
    ...htmlFiles,
  ].join('\n- '));
}
const content = htmlFiles.map(key => requireHTML(key)).join('');

const slides = document.createElement('div');
slides.className = 'slides';
slides.innerHTML = content;
const reveal = document.createElement('div');
document.body.append(reveal);
reveal.className = 'reveal';
reveal.append(slides);

const requireCSS = require.context('.', true, /\/style.css$/);
const cssFiles = requireCSS.keys();
cssFiles.forEach(requireCSS);

const requireJS = require.context('.', true, /\/index.js$/);
const jsFiles = requireJS.keys();
jsFiles.forEach(requireJS);

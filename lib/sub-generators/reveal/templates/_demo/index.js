import Reveal from 'reveal.js';
import 'reveal.js/css/reveal.css';
import 'reveal.js/css/theme/black.css';
<% if (syntax) { -%>
/* syntax-highlight */
import 'reveal.js/plugin/highlight/highlight';
import 'reveal.js/lib/css/zenburn.css';
/* /syntax-highlight */
<% } -%>
import './slides';
import './style.css';

Reveal.initialize({
  controls: false,
  history: true,
  progress: false,
});

<% if (syntax) { -%>
window.hljs.initHighlightingOnLoad();
<% } -%>

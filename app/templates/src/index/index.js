import iconPlus from '#/resources/icons/plus.svg';
import './style.css';

function hello() {
  const el = document.createElement('h1');
  el.innerHTML = 'hello, world';
  document.body.appendChild(el);
  const div = document.createElement('div');
  div.innerHTML = `<svg><use href="#${iconPlus.id}" /></svg>`;
  document.body.appendChild(div);
}

hello();

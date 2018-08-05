import { scaleWidth } from '#/common/scale';
import iconPlus from '#/resources/svg/plus.svg';
import './style.css';

function hello() {
  const { body } = document;
  const div = document.createElement('div');
  div.innerHTML = `hello, world <svg class="icon"><use href="#${iconPlus.id}" /></svg>`;
  body.appendChild(div);
}

hello();
scaleWidth();

import { createElement } from '#/common/util';
import { scaleWidth } from '#/common/scale';
import iconPlus from '#/resources/icons/plus.svg';
import './style.css';

function hello() {
  const { body } = document;
  body.appendChild(createElement('div', {
    innerHTML: `hello, world <svg class="icon"><use href="#${iconPlus.id}" /></svg>`,
  }));
}

hello();
scaleWidth();

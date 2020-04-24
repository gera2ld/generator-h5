import iconPlus from '#/resources/svg/plus.svg';
import '#/common/style.css';

function hello() {
  const { body } = document;
  const div = document.createElement('div');
  div.className = 'container mx-auto p-4';
  div.innerHTML = `<div class="bg-orange-200 p-4"><div class="bg-orange-400 p-4">hello, world <svg class="icon"><use href="#${iconPlus.id}" /></svg></div></div>`;
  body.appendChild(div);
}

hello();

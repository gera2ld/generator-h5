import './style.css';

function hello() {
  const el = document.createElement('h1');
  el.innerHTML = 'hello, world';
  document.body.appendChild(el);
}

hello();

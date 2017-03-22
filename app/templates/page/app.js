<% if (es6) { -%>
async function hello() {
  const el = document.createElement('h1');
  el.innerHTML = 'hello, world';
  document.body.appendChild(el);
}
<% } else { -%>
function hello() {
  var el = document.createElement('h1');
  el.innerHTML = 'hello, world';
  document.body.appendChild(el);
}
<% } -%>

hello();

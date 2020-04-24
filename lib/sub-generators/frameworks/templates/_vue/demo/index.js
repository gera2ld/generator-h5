import Vue from 'vue';
import App from './app';
import '#/common/style.css';

const vm = new Vue({
  render: h => h(App),
}).$mount();
document.body.appendChild(vm.$el);

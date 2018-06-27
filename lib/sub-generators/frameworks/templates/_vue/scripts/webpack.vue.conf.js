const VueLoaderPlugin = require('vue-loader/lib/plugin');
const vueLoaderConfig = require('./vue-loader.conf');

module.exports = config => {
  config.resolve.extensions.push('.vue');
  config.module.rules.unshift({
    test: /\.vue$/,
    loader: 'vue-loader',
    options: vueLoaderConfig,
  });
  config.plugins.push(new VueLoaderPlugin());
  return config;
};

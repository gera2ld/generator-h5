const webpackUtil = require('webpack-util/webpack');
const { isProd, defaultOptions, combineConfig } = require('webpack-util/util');

<% if (ts) { -%>
defaultOptions.jsOptions = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  test: /\.(js|ts)$/,
};
<% } -%>
// defaultOptions.hashedFilename = isProd;

const baseConfig = combineConfig({
<% if (ts) { -%>
  resolve: {
    extensions: ['.wasm', '.ts', '.mjs', '.js', '.json'],
  },
<% } -%>
}, [
  webpackUtil.common(),
  webpackUtil.css(),
  webpackUtil.url(),
  webpackUtil.raw(),
  webpackUtil.svg(),
  <%= features.includes('devServer') ? '' : '// ' %>webpackUtil.devServer(),
  <%= features.includes('sw') ? '' : '// ' %>webpackUtil.sw(),
  process.env.RUN_ENV === 'analyze' && webpackUtil.analyze(),
/** WEBPACK_BASE_CONFIG **/
]);

module.exports = baseConfig;

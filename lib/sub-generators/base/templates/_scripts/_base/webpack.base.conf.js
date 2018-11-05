const webpackUtil = require('webpack-util/webpack');
// const { isProd, defaultOptions } = require('webpack-util/util');

// defaultOptions.hashedFilename = isProd;

const baseConfig = [
  webpackUtil.common(),
  webpackUtil.css(),
  webpackUtil.url(),
  webpackUtil.raw(),
  webpackUtil.svg(),
  <%= features.includes('devServer') ? '' : '// ' %>webpackUtil.devServer(),
  <%= features.includes('sw') ? '' : '// ' %>webpackUtil.sw(),
  process.env.RUN_ENV === 'analyze' && webpackUtil.analyze(),
/** WEBPACK_BASE_CONFIG **/
]
.filter(Boolean)
.reduce(
  (config, apply) => (apply && apply(config) || config),
  {},
);

module.exports = baseConfig;

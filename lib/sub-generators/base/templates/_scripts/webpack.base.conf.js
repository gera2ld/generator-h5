const webpackUtil = require('webpack-util/webpack');

const baseConfig = [
  webpackUtil.common(),
  webpackUtil.css(),
  webpackUtil.url(),
  webpackUtil.raw(),
  webpackUtil.svg(),
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

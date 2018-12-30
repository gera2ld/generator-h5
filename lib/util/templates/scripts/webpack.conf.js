const baseConfigProvider = require('webpack-util/config/webpack.base.conf');
const webpackUtil = require('webpack-util/webpack');
const { parseConfig, combineConfig } = require('webpack-util/util');
const pages = require('./pages.conf');

module.exports = async () => {
  const baseConfig = await parseConfig(baseConfigProvider);
  const config = await combineConfig(baseConfig, [
/** WEBPACK_CONFIG **/
  ]);
  return webpackUtil.html({ pages })(config);
};

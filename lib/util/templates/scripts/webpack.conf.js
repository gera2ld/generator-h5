const webpackConfig = require('webpack-util/config/webpack.conf');
const webpackUtil = require('webpack-util/webpack');
const { defaultOptions, parseConfig, combineConfig } = require('webpack-util/util');
const pages = require('./pages.conf');
/** WEBPACK_PREPARE **/

module.exports = async () => {
  const config = await combineConfig(parseConfig(webpackConfig), [
/** WEBPACK_PLUGINS **/
  ], {
    ...defaultOptions,
/** WEBPACK_OPTIONS **/
  });
/** WEBPACK_MODIFICATIONS **/
  return config;
};

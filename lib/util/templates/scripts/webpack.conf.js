const webpackConfig = require('webpack-util/config/webpack.conf');
const webpackUtil = require('webpack-util/webpack');
const { defaultOptions, parseConfig, combineConfig } = require('webpack-util/util');
const pages = require('./pages.conf');

module.exports = async () => {
  const config = await combineConfig(parseConfig(webpackConfig), [
/** WEBPACK_CONFIG **/
  ], {
    ...defaultOptions,
/** WEBPACK_OPTIONS **/
  });
  return config;
};

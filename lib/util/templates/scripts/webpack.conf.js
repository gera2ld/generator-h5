const webpackUtil = require('webpack-util/webpack');
const { defaultOptions, loadDefaultWebpackConfig, combineConfig } = require('webpack-util/util');
/** WEBPACK_PREPARE **/

module.exports = async () => {
  const config = await combineConfig(loadDefaultWebpackConfig(), [
/** WEBPACK_PLUGINS **/
  ], {
    ...defaultOptions,
/** WEBPACK_OPTIONS **/
  });
/** WEBPACK_MODIFICATIONS **/
  return config;
};

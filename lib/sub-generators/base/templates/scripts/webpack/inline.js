const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const { isProd } = require('../util');

module.exports = config => {
  config.plugins = [
    ...config.plugins || [],
    isProd && new HtmlWebpackInlineSourcePlugin(),
  ].filter(Boolean);
};

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const base = require('./webpack.base.conf');
const { IS_DEV, merge } = require('./utils');
const INLINE = <%= inline %> && !IS_DEV;
const MINIFY = !IS_DEV && {
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};

const targets = module.exports = [];

targets.push(merge(base, {
  entry: {
    index: 'src/index',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      minify: MINIFY,
      filename: 'index.html',
    }),
    !IS_DEV && new ExtractTextPlugin('[name].css'),
    INLINE && new HtmlWebpackInlineSourcePlugin(),
  ].filter(Boolean),
}));

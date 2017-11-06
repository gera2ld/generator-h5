const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const base = require('./webpack.base.conf');
const pages = require('./pages.conf');
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

const entries = Object.entries(pages)
.reduce((res, [key, { entry }]) => Object.assign(res, { [key]: entry }), {});
const htmlPlugins = Object.entries(pages)
.map(([key, { html }]) => html && new HtmlWebpackPlugin(Object.assign({
  inlineSource: '.(js|css)$',
  minify: MINIFY,
  filename: `${key}.html`,
  chunks: [key],
}, html)))
.filter(Boolean);

targets.push(merge(base, {
  entry: entries,
  plugins: [
    ...htmlPlugins,
    !IS_DEV && new ExtractTextPlugin('[name].css'),
    INLINE && new HtmlWebpackInlineSourcePlugin(),
  ].filter(Boolean),
}));

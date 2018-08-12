const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.conf');
const pages = require('./pages.conf');
const { isProd } = require('./util');
const MINIFY = isProd && {
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};
const defaultTemplateOptions = {
  minify: MINIFY,
  template: 'scripts/template.html',
  meta: { viewport: 'width=device-width,initial-scale=1.0' },
  css: [],
  js: [],
};

const targets = module.exports = [];

const entries = Object.entries(pages)
.reduce((res, [key, { entry }]) => Object.assign(res, { [key]: entry }), {});
const htmlPlugins = Object.entries(pages)
.map(([key, { html }]) => {
  let options;
  if (html) {
    options = {
      filename: `${key}.html`,
      chunks: [key],
      ...defaultTemplateOptions,
    };
    if (typeof html === 'function') {
      options = html(options);
    } else {
      options = {
        ...options,
        ...html,
      };
    }
  }
  if (options) {
    if (options.inlineSource) options.inject = false;
    return new HtmlWebpackPlugin(options);
  }
})
.filter(Boolean);

targets.push({
  ...base,
  entry: entries,
  plugins: [
    ...base.plugins,
    ...htmlPlugins,
  ].filter(Boolean),
});

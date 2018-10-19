const { html } = require('webpack-util/webpack');
const config = require('./webpack.base.conf');
const pages = require('./pages.conf');

module.exports = html({ pages })(config);

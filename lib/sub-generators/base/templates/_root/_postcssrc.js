const { config } = require('webpack-util/postcss');
const px2rem = require('webpack-util/postcss/px2rem')();

module.exports = px2rem(config);

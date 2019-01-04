let { config } = require('webpack-util/postcss');

<% if (features.includes('px2rem')) { -%>
const px2rem = require('webpack-util/postcss/px2rem')();
config = px2rem(config);

<% } -%>
module.exports = config;

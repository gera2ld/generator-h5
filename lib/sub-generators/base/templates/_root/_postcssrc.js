const { config } = require('webpack-util/postcss');
<% if (features.includes('px2rem')) { -%>
const px2rem = require('webpack-util/postcss/px2rem');
<% } -%>

<% if (features.includes('px2rem')) { -%>
module.exports = px2rem(config);
<% } else { -%>
module.exports = config;
<% } -%>

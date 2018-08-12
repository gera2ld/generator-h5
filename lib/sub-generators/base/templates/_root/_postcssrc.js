<%
// const { isProd } = require('./scripts/util');
-%>
module.exports = {
  // Transform inline comments
  parser: require('postcss-scss'),
  plugins: [
    require('autoprefixer'),
    // Transform SCSS into CSS
    require('precss'),
<%
    // isProd && require('cssnano'),
-%>
  ].filter(Boolean),
};

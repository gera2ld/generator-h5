module.exports = {
  extends: require.resolve('@gera2ld/plaid/config/babelrc'),
  presets: [
<% if (ts) { -%>
    '@babel/preset-typescript',
<% } -%>
/** BABEL_PRESETS **/
  ],
  plugins: [
  ]
};

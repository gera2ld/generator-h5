module.exports = {
  root: true,
  extends: [
    require.resolve('webpack-util/eslint'),
<% if (!target) { -%>
    require.resolve('webpack-util/eslint/modern'),
<% } -%>
/** ESLINT_EXTEND **/
  ],
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  rules: {
/** ESLINT_RULES **/
  },
};

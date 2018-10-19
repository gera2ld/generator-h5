module.exports = {
  extends: [
    require.resolve('webpack-util/eslint'),
<% if (!target) { -%>
    require.resolve('webpack-util/eslint/modern'),
<% } -%>
/** ESLINT_EXTEND **/
  ],
  rules: {
/** ESLINT_RULES **/
  },
};

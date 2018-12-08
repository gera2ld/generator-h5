module.exports = {
  root: true,
  extends: [
    require.resolve('webpack-util/eslint'),
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

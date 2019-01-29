module.exports = {
  root: true,
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
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

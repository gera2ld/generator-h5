module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb<% if (!frameworks.react) { %>-base<% } %>',
  ],
  env: {
    browser: true,
  },
  plugins: [
<% if (frameworks.vue) { -%>
    // required to lint *.vue files
    'html',
<% } -%>
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'scripts/webpack.conf.js'
      }
    }
  },
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
<% if (frameworks.vue) { -%>
      vue: 'never',
<% } -%>
    }],
    'no-param-reassign': ['error', { props: false }],
    'consistent-return': 'off',
    'no-use-before-define': ['error', 'nofunc'],
    'no-mixed-operators': 'off',
    'no-bitwise': ['error', { int32Hint: true }],
    'arrow-parens': ['error', 'as-needed'],
    'prefer-promise-reject-errors': 'off',
    'prefer-destructuring': ['error', { array: false }],
    'no-console': ['warn', {
      allow: ['error', 'warn', 'info'],
    }],
<% if (frameworks.react) { -%>
    'react/jsx-filename-extension': 'off',
<% } -%>
  },
};

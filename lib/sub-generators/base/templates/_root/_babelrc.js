module.exports = {
  presets: [
<% if (ts) { -%>
    '@babel/preset-typescript',
<% } -%>
    ['@babel/preset-env', {
<% if (test) { -%>
      ...process.env.BABEL_ENV !== 'test' && {
        modules: false,
      },
<% } else { -%>
      modules: false,
<% } -%>
      useBuiltIns: 'usage'
    }],
/** BABEL_PRESETS **/
  ],
  plugins: [
    '@babel/plugin-transform-runtime',

    // stage-2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // stage-3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    // Use loose mode: facebook/create-react-app#4263
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-json-strings',

    ['module-resolver', {
      alias: {
        '#': './src',
      },
      extensions: [
        '.js', '.vue',
      ],
    }],
  ]
};

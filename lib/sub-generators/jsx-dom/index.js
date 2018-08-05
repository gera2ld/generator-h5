const Generator = require('yeoman-generator');
const { replaceContent, install } = require('../../util');

module.exports = class JSXGenerator extends Generator {
  writing() {
    this.fs.copy(this.templatePath('demo'), this.destinationPath('src/demo-jsx'));
    replaceContent(
      this,
      'scripts/pages.conf.js',
      content => content.replace(/};\s*$/, m => `\
  'demo-jsx': {
    entry: './src/demo-jsx',
    html: {
      title: 'JSX demo',
    },
  },
${m}`),
    );
    replaceContent(
      this,
      '.babelrc',
      content => content.replace('"plugins": [', m => `${m}
    ["@babel/plugin-transform-react-jsx", { "pragma": "h" }],`),
    );
    replaceContent(
      this,
      '.eslintrc.js',
      eslint => {
        return eslint
        .replace('plugins: [],', `plugins: [
    'react',
  ],`)
        .replace('rules: {', `rules: {
    'react/jsx-uses-react': 'error',
    'react/react-in-jsx-scope': 'error',`)
        .replace('settings: {', `settings: {
    react: {
      pragma: 'h',
    },`);
      },
    );
  }

  install() {
    const devDeps = [];
    const deps = [];
    devDeps.push(
      '@babel/plugin-transform-react-jsx',
      'eslint-plugin-react',
    );
    deps.push(
      '@gera2ld/jsx-dom',
    );
    install(this, devDeps, deps);
  }
}

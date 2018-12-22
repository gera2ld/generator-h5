const Generator = require('yeoman-generator');
const { replaceContent, install } = require('../../util');

module.exports = class JSXGenerator extends Generator {
  copy() {
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    this.fs.copy(this.templatePath('demo'), this.destinationPath('src/demo-jsx'));
    replaceContent(
      this,
      'scripts/pages.conf.js',
      content => content.replace('/** PAGES **/', m => `\
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
      '.babelrc.js',
      content => content.replace('/** BABEL_PRESETS **/', m => `
    // react
    ['@babel/preset-react', {
      pragma: 'h',
    }],
${m}`),
    );
    replaceContent(
      this,
      '.eslintrc.js',
      eslint => {
        return eslint
        .replace('/** ESLINT_EXTEND **/', m => `\
    require.resolve('./scripts/eslint/jsx'),
${m}`);
      },
    );
  }

  install() {
    const devDeps = [];
    const deps = [];
    devDeps.push(
      '@babel/preset-react',
    );
    deps.push(
      '@gera2ld/jsx-dom',
    );
    install(this, devDeps, deps);
  }
}

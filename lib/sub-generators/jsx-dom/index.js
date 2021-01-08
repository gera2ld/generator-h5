const Generator = require('yeoman-generator');
const { replaceContent, install, concatList } = require('../../util');

module.exports = class JSXGenerator extends Generator {
  _updateDeps() {
    const devDepList = [];
    const depList = [];
    devDepList.push(
      '@gera2ld/plaid-common-react',
    );
    depList.push(
      '@gera2ld/jsx-dom',
    );
    this.state.depList = concatList(this.state.depList, depList);
    this.state.devDepList = concatList(this.state.devDepList, devDepList);
  }

  copy() {
    this.state = this.options.state || {};
    this._updateDeps();
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    this.fs.copy(this.templatePath('demo'), this.destinationPath('src/pages/demo-jsx'));
    replaceContent(
      this,
      'scripts/plaid.conf.js',
      content => content.replace('/** PAGES **/', m => `\
  'demo-jsx': {
    html: {
      title: 'JSX demo',
    },
  },
${m}`),
    );
    replaceContent(
      this,
      '.babelrc.js',
      content => content.replace('/** BABEL_PRESETS **/', m => `\
    // react
    '@babel/preset-react',
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
    install(this);
  }
}

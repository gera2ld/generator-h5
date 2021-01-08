const Generator = require('yeoman-generator');
const { replaceContent, addWebpackConfig, install } = require('../../util');

module.exports = class RevealGenerator extends Generator {
  _updateDeps() {
    const devDepList = [];
    const depList = [];
    if (this.state.syntax) {
      devDepList.push('script-loader');
    }
    depList.push(
      'reveal.js',
    );
    this.state.depList = concatList(this.state.depList, depList);
    this.state.devDepList = concatList(this.state.devDepList, devDepList);
  }

  async prompting() {
    const answers = await this.prompt([
      {
        name: 'syntax',
        type: 'confirm',
        message: 'Would you like to enable syntax highlight?',
        default: false,
      },
    ]);
    this.state = Object.assign(this.options.state || {}, answers);
    this._updateDeps();
  }

  copy() {
    this.fs.copyTpl(this.templatePath('_demo'), this.destinationPath('src/pages/demo-reveal'), this.state);
    if (this.state.syntax) {
      this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
      addWebpackConfig(this, {
        plugins: `\
  require('./webpack/script'),
`,
      });
      this.fs.copy(this.templatePath('syntax'), this.destinationPath('src/pages/demo-reveal'));
    }
    replaceContent(
      this,
      'scripts/plaid.conf.js',
      content => content.replace('/** PAGES **/', m => `\
  'demo-reveal': {
    html: {
      title: 'Reveal demo',
    },
  },
${m}`),
    );
  }

  install() {
    const devDeps = [];
    const deps = [];
    if (this.state.syntax) {
      devDeps.push('script-loader');
    }
    deps.push(
      'reveal.js',
    );
    install(this, devDeps, deps);
  }
}

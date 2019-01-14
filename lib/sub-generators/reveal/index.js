const Generator = require('yeoman-generator');
const { replaceContent, addWebpackConfig, install } = require('../../util');

module.exports = class RevealGenerator extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        name: 'syntax',
        type: 'confirm',
        message: 'Would you like to enable syntax highlight?',
        default: false,
      },
    ]);
    this.state = answers;
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
      'scripts/pages.conf.js',
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

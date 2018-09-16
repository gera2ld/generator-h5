const Generator = require('yeoman-generator');
const { replaceContent, install } = require('../../util');

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

  writing() {
    this.fs.copyTpl(this.templatePath('_demo'), this.destinationPath('src/demo-reveal'), this.state);
    if (this.state.syntax) {
      this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
      this.fs.copy(this.templatePath('syntax'), this.destinationPath('src/demo-reveal'));
    }
    replaceContent(
      this,
      'scripts/pages.conf.js',
      content => content.replace(/};\s*$/, m => `\
  'demo-reveal': {
    entry: './src/demo-reveal',
    html: {
      title: 'Reveal demo',
    },
  },
${m}`),
    );
    replaceContent(
      this,
      'scripts/webpack.base.conf.js',
      content => {
        content = content.replace('// require(\'./webpack/raw\')', m => m.slice(3));
        if (this.state.syntax) {
          content = content.replace('].reduce(', m => `\
  require('./webpack/script'),
${m}`);
        }
        return content;
      },
    );
  }

  install() {
    const devDeps = [];
    const deps = [];
    devDeps.push(
      'raw-loader',
    );
    if (this.state.syntax) {
      devDeps.push('script-loader');
    }
    deps.push(
      'reveal.js',
    );
    install(this, devDeps, deps);
  }
}
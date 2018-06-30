const Generator = require('yeoman-generator');

module.exports = class JSXGenerator extends Generator {
  initializing() {
    this.composeWith(require.resolve('../../sub-generators/base'));
    this.composeWith(require.resolve('../../sub-generators/jsx-dom'));
  }
}

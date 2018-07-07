const Generator = require('yeoman-generator');

module.exports = class HTML5Generator extends Generator {
  initializing() {
    this.composeWith(require.resolve('../../sub-generators/base'), {
      styleLoader: false,
      eslintConfig: false,
    });
    this.composeWith(require.resolve('../../sub-generators/frameworks'));
  }
}

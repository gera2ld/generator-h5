const Generator = require('yeoman-generator');

module.exports = class HTML5Generator extends Generator {
  initializing() {
    this.composeWith(require.resolve('../../sub-generators/base'), {
      skipStyleLoader: true,
    });
    this.composeWith(require.resolve('../../sub-generators/frameworks'));
  }
}

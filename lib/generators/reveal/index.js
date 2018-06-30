const Generator = require('yeoman-generator');

module.exports = class RevealGenerator extends Generator {
  initializing() {
    this.composeWith(require.resolve('../../sub-generators/base'));
    this.composeWith(require.resolve('../../sub-generators/reveal'));
  }
}

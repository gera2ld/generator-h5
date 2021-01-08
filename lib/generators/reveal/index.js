const Generator = require('yeoman-generator');

module.exports = class RevealGenerator extends Generator {
  initializing() {
    const options = { state: {} };
    this.composeWith(require.resolve('../../sub-generators/base'), options);
    this.composeWith(require.resolve('../../sub-generators/reveal'), options);
  }
}

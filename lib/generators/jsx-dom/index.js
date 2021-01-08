const Generator = require('yeoman-generator');

module.exports = class JSXGenerator extends Generator {
  initializing() {
    const options = { state: {} };
    this.composeWith(require.resolve('../../sub-generators/base'), options);
    this.composeWith(require.resolve('../../sub-generators/jsx-dom'), options);
  }
}

const fs = require('fs');
const Generator = require('yeoman-generator');

const utils = {
  identity(s) {
    return s;
  },
  commentLines(str) {
    return str.split('\n')
    .map(line => {
      line = line.trimRight();
      return line ? line.replace(/^\s*/, m => `${m}# `) : line;
    })
    .join('\n');
  },
};

module.exports = class Html5Generator extends Generator {
  prompting() {
    return this.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Your project name',
        default: this.appname,
      },
      {
        name: 'description',
        type: 'input',
        message: 'Description of your project',
      },
      {
        name: 'target',
        type: 'list',
        message: 'How many browsers would you like to support for CSS?',
        choices: [{
          name: 'only the latest modern browsers',
          value: '',
        }, {
          name: 'include older browsers since IE 9',
          value: 'es5',
        }],
      },
      {
        name: 'inline',
        type: 'confirm',
        message: 'Would you like to inline JavaScript and CSS in production mode?',
        default: true,
      },
    ])
    .then(answers => {
      this.state = Object.assign({
        utils,
      }, answers);
    });
  }

  templates() {
    const rootFileDir = this.templatePath('root-files');
    fs.readdirSync(rootFileDir)
    .forEach(name => {
      if (name.startsWith('.')) return;
      this.fs.copyTpl(`${rootFileDir}/${name}`, this.destinationPath(name.replace(/^_/, '.')), this.state);
    });
    const scripts = this.templatePath('scripts');
    fs.readdirSync(scripts)
    .forEach(name => {
      if (name.startsWith('.')) return;
      this.fs.copyTpl(`${scripts}/${name}`, this.destinationPath(`scripts/${name}`), this.state);
    });
  }

  app() {
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
  }

  install() {
    const deps = [
      'browser-sync',
      'cross-env',
      'del',
      'gulp',
      'gulp-util',
      'eslint',
      'babel-eslint',
      'eslint-config-airbnb-base',
      'eslint-plugin-import',
      'webpack',
      'postcss-scss',
      'precss',
      'autoprefixer',
      'babel-runtime',
      'babel-preset-env',
      'babel-plugin-transform-runtime',
      'extract-text-webpack-plugin',
      'html-webpack-plugin',
      'html-webpack-inline-source-plugin',
      'babel-minify-webpack-plugin',
      'babel-loader',
      'style-loader',
      'css-loader',
      'postcss-loader',
      'url-loader',
      'file-loader',
    ];
    const res = this.spawnCommandSync('yarn', ['--version']);
    if (res.error && res.error.code === 'ENOENT') {
      this.npmInstall(deps, {saveDev: true});
    } else {
      this.yarnInstall(deps, {dev: true});
    }
  }
};

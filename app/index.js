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
        name: 'multiplePages',
        type: 'confirm',
        message: 'Would you like to develop multiple pages?',
        default: false,
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

  rootFiles() {
    const rootFileDir = this.templatePath('root-files');
    fs.readdirSync(rootFileDir)
    .forEach(name => {
      if (name.startsWith('.')) return;
      this.fs.copyTpl(`${rootFileDir}/${name}`, this.destinationPath(name.replace(/^_/, '.')), this.state);
    });
  }

  app() {
    if (this.state.multiplePages) {
      this.fs.copy(this.templatePath('page/contents.html'), this.destinationPath('src/index.html'));
      ['index.html', 'app.js', 'style.css']
      .forEach(name => {
        this.fs.copyTpl(this.templatePath(`page/${name}`), this.destinationPath(`src/pages/home/${name}`), this.state);
      });
    } else {
      ['index.html', 'app.js', 'style.css']
      .forEach(name => {
        this.fs.copyTpl(this.templatePath(`page/${name}`), this.destinationPath(`src/${name}`), this.state);
      });
    }
    this.fs.copy(this.templatePath('assets'), this.destinationPath('src/assets'));
  }

  install() {
    const deps = [
      'browser-sync',
      'cross-env',
      'del',
      'gulp',
      'gulp-eslint',
      'gulp-htmlmin',
      'gulp-plumber',
      'gulp-postcss',
      'postcss-scss',
      'precss',
      'autoprefixer',
      'cssnano',
      'gulp-util',
      'gulp-assets-injector',
      'gulp-rollup',
      'rollup-plugin-babel',
      'rollup-plugin-node-resolve',
      'rollup-plugin-commonjs',
      'rollup-plugin-babel-minify',
      'babel-runtime',
      'babel-preset-env',
      'babel-plugin-transform-runtime',
      'eslint-config-airbnb-base',
      'eslint-plugin-import',
    ];
    const res = this.spawnCommandSync('yarn', ['--version']);
    if (res.error && res.error.code === 'ENOENT') {
      this.npmInstall(deps, {saveDev: true});
    } else {
      this.yarnInstall(deps, {dev: true});
    }
  }
};

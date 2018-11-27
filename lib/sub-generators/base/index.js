const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const globby = require('globby');
const { install, replaceJSON, replaceContent } = require('../../util');

module.exports = class BaseGenerator extends Generator {
  _copyDir(src, dest) {
    const files = globby.sync(`${this.templatePath(src)}/**`, { nodir: true });
    const dir = this.destinationPath(dest);
    for (const file of files) {
      const destFile = path.join(dir, path.basename(file).replace(/^_/, '.'));
      this.fs.copyTpl(file, destFile, this.state);
    }
  }

  async prompting() {
    let pkg;
    try {
      pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      delete pkg.dependencies;
      delete pkg.devDependencies;
    } catch (err) {
      // ignore
    }
    pkg = pkg || {};
    this.state = { pkg };
    const answers = await this.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Your project name',
        default: pkg.name || this.appname,
      },
      {
        name: 'target',
        type: 'list',
        message: 'Which browsers would you like to support for CSS?',
        choices: [{
          name: 'only the latest modern browsers',
          value: '',
        }, {
          name: 'include older browsers',
          value: 'es5',
        }],
      },
      {
        name: 'gulp',
        type: 'confirm',
        message: 'Do you want to use Gulp?',
        default: false,
      },
      {
        name: 'features',
        type: 'checkbox',
        message: 'Which features would you like to enable?',
        choices: [{
          name: 'dev server with hot reload',
          value: 'devServer',
        }, {
          name: 'service worker',
          value: 'sw',
        }],
        default: ['devServer'],
      },
      {
        name: 'test',
        type: 'confirm',
        message: 'Would you like to add tests?',
        default: false,
      },
    ]);
    Object.assign(this.state, answers);
  }

  copy() {
    this._copyDir('_root', '.');
    this._copyDir('_scripts/_base', 'scripts');
    replaceJSON(this, 'package.json', pkg => {
      const scripts = {
        ...this.state.pkg.scripts,
        ...pkg.scripts,
        ...this.state.gulp ? {
          dev: 'gulp dev',
          build: 'cross-env NODE_ENV=production gulp build',
        } : {
          dev: 'webpack-util develop',
          build: 'webpack-util build',
        },
      };
      if (this.state.test) {
        scripts.pretest = this.state.gulp
          ? 'cross-env NODE_ENV=test gulp buildTest'
          : 'cross-env NODE_ENV=test webpack --config scripts/webpack.test.conf';
        scripts.test = 'node dist/test';
      }
      return {
        ...pkg,
        ...this.state.pkg,
        name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
        scripts,
      };
    });
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    this.fs.write(this.destinationPath('src/public/.gitkeep'), '');
    if (this.state.gulp) {
      this._copyDir('_gulp', '.');
    }
    if (this.state.test) {
      this.fs.copy(this.templatePath('_scripts/test'), this.destinationPath('scripts'));
      this.fs.copy(this.templatePath('test'), this.destinationPath('test'));
    }
  }

  writing() {
    const clean = content => content.replace(/\/\*\* (.*?) \*\*\/\n?/g, '');
    [
      '.babelrc',
      '.eslintrc.js',
      'scripts/pages.conf.js',
      'scripts/webpack.base.conf.js',
    ].forEach(file => {
      replaceContent(this, file, clean);
    });
  }

  install() {
    const devDeps = [];
    const deps = [];
    devDeps.push(
      'eslint',
      'postcss-scss',
      'precss',
      'autoprefixer',
      'postcss-calc',
      'husky',
      'webpack-util',
      'svgo',
    );
    deps.push(
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
      'core-js',
    );
    if (this.state.gulp) {
      devDeps.push(
        'gulp@next',
      );
    }
    if (this.state.test) {
      devDeps.push(
        'tape',
      );
    }
    install(this, devDeps, deps);
  }
};

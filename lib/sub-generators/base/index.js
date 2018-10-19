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
        name: 'features',
        type: 'checkbox',
        message: 'Which features would you like to enable?',
        choices: [{
          name: 'copy files from src/public/**',
          value: 'copy',
        }, {
          name: 'service worker',
          value: 'sw',
        }],
        default: [],
      },
    ]);
    Object.assign(this.state, answers);
  }

  copy() {
    this._copyDir('_root', '.');
    this._copyDir('_scripts', 'scripts');
    replaceJSON(this, 'package.json', pkg => {
      const scripts = {
        ...pkg.scripts,
        ...this.state.pkg.scripts,
      };
      return {
        ...pkg,
        ...this.state.pkg,
        name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
        scripts,
      };
    });
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    this.fs.copy(this.templatePath('resources'), this.destinationPath('src/resources'));
    this.fs.write(this.destinationPath('src/public/.gitkeep'), '');
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
      'browser-sync',
      'del',
      'gulp@next',
      'fancy-log',
      'eslint',
      'postcss-scss',
      'precss',
      'autoprefixer',
      'postcss-calc',
      'husky',
      'webpack-util',
    );
    deps.push(
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
    );
    install(this, devDeps, deps);
  }
};

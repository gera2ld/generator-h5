const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const globby = require('globby');
const { install, replaceJSON, replaceContent } = require('../../util');

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
    this.state = {
      pkg,
      utils,
    };
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
      'cross-env',
      'del',
      'gulp@next',
      'fancy-log',
      'eslint',
      'babel-eslint',
      'eslint-import-resolver-webpack',
      'eslint-plugin-import',
      'webpack',
      'postcss-scss',
      'precss',
      'autoprefixer',
      'postcss-calc',
      // 'cssnano',
      'mini-css-extract-plugin',
      'html-webpack-plugin',
      'css-loader',
      'postcss-loader',
      'url-loader',
      'file-loader',
      'raw-loader',
      'svg-sprite-loader',
      'sw-precache-webpack-plugin',
      '@intervolga/optimize-cssnano-plugin',
      'husky',
      'webpack-bundle-analyzer',

      // babel
      'babel-loader',
      '@babel/core',
      '@babel/preset-env',
      '@babel/plugin-transform-runtime',

      // stage-2
      '@babel/plugin-proposal-decorators',
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',

      // stage-3
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-json-strings',
    );
    if (this.options.styleLoader != false) {
      devDeps.push(
        this.options.styleLoader || 'style-loader',
      );
    }
    if (this.options.eslintConfig != false) {
      devDeps.push(
        this.options.eslintConfig || 'eslint-config-airbnb-base',
      );
    }
    deps.push(
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
    );
    install(this, devDeps, deps);
  }
};

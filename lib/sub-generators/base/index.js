const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const globby = require('globby');
const { install } = require('../../util');

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
      delete pkg.scripts;
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
        message: 'How many browsers would you like to support for CSS?',
        choices: [{
          name: 'only the latest modern browsers',
          value: '',
        }, {
          name: 'include older browsers',
          value: 'es5',
        }],
      },
      {
        name: 'inline',
        type: 'confirm',
        message: 'Would you like to inline JavaScript and CSS in production mode?',
        default: false,
      },
    ]);
    Object.assign(this.state, answers);
  }

  writing() {
    this._copyDir('_root', '.');
    this._copyDir('_scripts', 'scripts');
    this.fs.extendJSON(this.destinationPath('package.json'), Object.assign({}, this.state.pkg, {
      name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
    }));
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    const browserslist = [
      '# See https://github.com/ai/browserslist#config-file for details\n',
      ...this.state.target ? [
        'defaults',
      ] : [
        'last 2 Chrome versions',
      ],
    ].join('\n');
    this.fs.write(this.destinationPath('.browserslistrc'), browserslist);
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
      'eslint@next', // React.Fragment is supported since eslint@5
      'babel-eslint',
      'eslint-import-resolver-webpack',
      'eslint-plugin-import',
      'webpack',
      'postcss-scss',
      'precss',
      'autoprefixer',
      'mini-css-extract-plugin',
      'html-webpack-plugin',
      'html-webpack-inline-source-plugin',
      'css-loader',
      'postcss-loader',
      'url-loader',
      'file-loader',
      'svg-sprite-loader',
      'husky@next',
      // babel
      'babel-loader@^8.0.0-beta',
      '@babel/core',
      '@babel/preset-env',
      '@babel/preset-stage-2',
      '@babel/plugin-transform-runtime',
    );
    if (!this.options.skipStyleLoader) {
      devDeps.push(
        'style-loader',
      );
    }
    deps.push(
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
    );
    install(this, devDeps, deps);
  }
};

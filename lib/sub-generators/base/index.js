const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const globby = require('globby');
const { install, replaceJSON, replaceContent, addWebpackConfig } = require('../../util');

function replaceDot(filename) {
  return filename.replace(/^_/, '.');
}

function renameToTs(filename) {
  return filename.replace(/\.js$/, '.ts');
}

module.exports = class BaseGenerator extends Generator {
  _copyDir(src, dest, handle = replaceDot) {
    const base = this.templatePath(src);
    const files = globby.sync(`${base}/**`, { nodir: true });
    const dir = this.destinationPath(dest);
    for (const file of files) {
      const relpath = path.relative(base, file);
      this.fs.copyTpl(file, path.join(dir, handle(relpath)), this.state);
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
        name: 'ts',
        type: 'confirm',
        message: 'Do you want to use TypeScript?',
        default: false,
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
          name: 'px to rem',
          value: 'px2rem',
        }, {
          name: 'gh-pages',
          value: 'ghPages',
        }, {
          name: 'service worker',
          value: 'sw',
        }],
        default: ['devServer', 'px2rem'],
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
    if (this.state.ts) {
      this._copyDir('_ts/_root', '.');
      this._copyDir('_ts/src', 'src');
      this._copyDir('src', 'src', renameToTs);
    } else {
      this._copyDir('_js/_root', '.');
      this._copyDir('src', 'src');
    }
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
      if (this.state.ts) {
        scripts.build = `tsc && ${scripts.build}`;
        scripts.lint = 'tslint -c tslint.json \'src/**/*.ts\'';
      }
      if (this.state.test) {
        scripts.test = 'cross-env BABEL_ENV=test tape -r ./test/mock/register \'test/**/*.test.js\'';
      }
      if (this.state.features.includes('ghPages')) {
        scripts.predeploy = 'npm run build';
        scripts.deploy = 'gh-pages -d dist';
      }
      return {
        ...pkg,
        ...this.state.pkg,
        name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
        scripts,
      };
    });
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    if (this.state.features.includes('sw')) {
      addWebpackConfig(this, `\
    webpackUtil.sw(),
`);
    }
    if (this.state.gulp) {
      this._copyDir('_gulp', '.');
    }
    if (this.state.test) {
      this.fs.copy(this.templatePath('test'), this.destinationPath('test'));
    }
  }

  writing() {
    const clean = content => content.replace(/\/\*\* (.*?) \*\*\/\n?/g, '');
    [
      '.babelrc.js',
      '.eslintrc.js',
      'scripts/pages.conf.js',
      'scripts/webpack.conf.js',
    ].forEach(file => {
      replaceContent(this, file, clean);
    });
  }

  install() {
    const devDeps = [];
    const deps = [];
    devDeps.push(
      'husky',
      'webpack-util',
      'svgo',
    );
    deps.push(
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
      'core-js',
      '@gera2ld/rem',
    );
    if (this.state.ts) {
      devDeps.push(
        '@babel/preset-typescript',
        'typescript',
        'tslint',
      );
    }
    if (this.state.gulp) {
      devDeps.push(
        'gulp',
      );
    }
    if (this.state.test) {
      devDeps.push(
        'tape',
        '@babel/register',
      );
    }
    if (this.state.features.includes('ghPages')) {
      devDeps.push(
        'gh-pages',
      );
    }
    install(this, devDeps, deps);
  }
};

const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const globby = require('globby');
const { install, replaceContent, addWebpackConfig, concatList, loadDeps } = require('../../util');

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

  _updateDeps() {
    const devDepList = [
      'husky',
      '@gera2ld/plaid',
      '@gera2ld/plaid-webpack',
    ];
    const depList = [
      '@babel/runtime',
      '@gera2ld/rem',
      'core-js',
    ];
    if (this.state.ts) {
      devDepList.push(
        '@gera2ld/plaid-common-ts',
      );
    }
    if (this.state.gulp) {
      devDepList.push(
        'gulp',
      );
    }
    if (this.state.test) {
      devDepList.push(
        '@gera2ld/plaid-test',
      );
    }
    this.state.depList = concatList(this.state.depList, depList);
    this.state.devDepList = concatList(this.state.devDepList, devDepList);
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
    this.state = Object.assign(this.options.state || {}, {
      pkg,
      year: new Date().getFullYear(),
    });
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
    this._updateDeps();
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
    const pkg = {
      name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
      private: true,
      ...this.state.pkg,
      scripts: {
        ...this.state.pkg.scripts,
        ...this.state.gulp ? {
          dev: 'gulp dev',
          build: 'cross-env NODE_ENV=production gulp build',
        } : {
          dev: 'plaid develop',
          build: 'plaid build',
        },
        postinstall: 'husky install',
        prebuild: 'npm run lint',
        analyze: 'plaid build -a',
        svgo: 'plaid svgo',
        lint: `eslint --ext .js${this.state.ts ? ',.ts' : ''} .`,
      },
    };
    if (this.state.test) {
      pkg.scripts.test = 'jest test';
    }
    pkg.dependencies = {
      ...pkg.dependencies,
      ...loadDeps(this.state.depList),
    };
    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...loadDeps(this.state.devDepList),
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkg);
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    if (this.state.features.includes('sw')) {
      addWebpackConfig(this, {
        plugins: `\
  isProd && configurators.sw,
`,
      });
      replaceContent(this, 'scripts/plaid.conf.js', content => content.replace('/** GLOBAL **/', m => `\
exports.swOptions = {
  globDirectory: 'dist',
  globPatterns: ['manifest.json'],
  runtimeCaching: [{
    urlPattern: /\.json$/,
    handler: 'NetworkFirst',
  }],
};
${m}`));
    }
    if (!this.state.features.includes('devServer')) {
      replaceContent(this, 'scripts/plaid.conf.js', content => content.replace('/** GLOBAL **/', m => `\
exports.devServer = false;
${m}`));
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
      'scripts/plaid.conf.js',
      'scripts/webpack.conf.js',
    ].forEach(file => {
      replaceContent(this, file, clean);
    });
  }

  install() {
    install(this);
  }
};

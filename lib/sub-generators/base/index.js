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
    this.state = {
      pkg,
      year: new Date().getFullYear(),
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
          dev: 'plaid develop',
          build: 'plaid build',
        },
        lint: `eslint --ext .js${this.state.ts ? ',.ts' : ''} .`,
      };
      if (this.state.test) {
        scripts.test = 'cross-env BABEL_ENV=test tape -r ./test/mock/register \'test/**/*.test.js\'';
      }
      if (this.state.features.includes('ghPages')) {
        scripts.predeploy = 'npm run build';
        scripts.deploy = 'gh-pages -td dist';
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
    if (this.state.features.includes('px2rem')) {
      this._copyDir('_postcss', '.');
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
    const devDeps = [];
    const deps = [];
    devDeps.push(
      'husky',
      '@gera2ld/plaid@~1.6.0',
      '@gera2ld/plaid-webpack@~1.6.0',
    );
    deps.push(
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
      '@gera2ld/rem',
      'core-js',
    );
    if (this.state.ts) {
      devDeps.push(
        '@babel/preset-typescript',
        'typescript',
        '@typescript-eslint/parser',
        '@typescript-eslint/eslint-plugin',
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

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

function copyDir(gen, src, dist) {
  fs.readdirSync(src)
  .forEach(name => {
    if (name.startsWith('.')) return;
    gen.fs.copyTpl(`${src}/${name}`, gen.destinationPath(`${dist}/${name.replace(/^_/, '.')}`), gen.state);
  });
}

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
        default: false,
      },
      {
        name: 'vue',
        type: 'confirm',
        message: 'Would you like to use Vue.js?',
        default: false,
      },
      {
        name: 'react',
        type: 'confirm',
        message: 'Would you like to use React.js?',
        default: false,
      },
    ])
    .then(answers => {
      this.state = Object.assign({
        utils,
      }, answers);
    });
  }

  templates() {
    copyDir(this, this.templatePath('_root'), '.');
    copyDir(this, this.templatePath('scripts'), 'scripts');
    if (this.state.vue) copyDir(this, this.templatePath('_vue/scripts'), 'scripts');
  }

  app() {
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    if (this.state.vue) this.fs.copy(this.templatePath('_vue/demo'), this.destinationPath('src/demo-vue'));
    if (this.state.react) this.fs.copy(this.templatePath('_react/demo'), this.destinationPath('src/demo-react'));
  }

  install() {
    const devDeps = [
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
      'extract-text-webpack-plugin',
      'html-webpack-plugin',
      'html-webpack-inline-source-plugin',
      'babel-minify-webpack-plugin',
      'style-loader',
      'css-loader',
      'postcss-loader',
      'url-loader',
      'file-loader',
      'svg-sprite-loader',
      'husky',
      // babel
      'babel-loader@8.0.0-beta.0',
      '@babel/core',
      '@babel/preset-env',
      '@babel/preset-stage-2',
    ];
    const deps = [
      '@babel/runtime',
    ];
    if (this.state.vue) {
      devDeps.push(
        'vue-loader',
        'vue-style-loader',
        'vue-template-compiler',
        'eslint-plugin-html',
      );
      deps.push(
        'vue',
      );
    }
    if (this.state.react) {
      devDeps.push(
        '@babel/preset-react',
        'eslint-config-airbnb',
        'eslint-plugin-react',
        'eslint-plugin-jsx-a11y',
      );
      deps.push(
        'react',
        'react-dom',
      );
    } else {
      devDeps.push(
        'eslint-config-airbnb-base',
      );
    }
    const res = this.spawnCommandSync('yarn', ['--version']);
    if (res.error && res.error.code === 'ENOENT') {
      this.npmInstall(devDeps, {saveDev: true});
      this.npmInstall(deps);
    } else {
      this.yarnInstall(devDeps, {dev: true});
      this.yarnInstall(deps);
    }
  }
};

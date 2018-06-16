const fs = require('mz/fs');
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

async function copyDir(gen, src, dist) {
  const files = await fs.readdir(src);
  files.forEach(name => {
    if (name.startsWith('.')) return;
    gen.fs.copyTpl(`${src}/${name}`, gen.destinationPath(`${dist}/${name.replace(/^_/, '.')}`), gen.state);
  });
}

module.exports = class Html5Generator extends Generator {
  async prompting() {
    let pkg;
    try {
      pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      delete pkg.scripts;
      delete pkg.dependencies;
      delete pkg.devDependencies;
    } catch (err) {
      // ignore
    }
    pkg = pkg || {};
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
        name: 'frameworks',
        type: 'checkbox',
        message: 'Which frameworks would you like to enable?',
        choices: [
          'Vue',
          'React',
        ],
      },
    ]);
    this.state = Object.assign({
      pkg,
      utils,
    }, answers);
    this.state.frameworks = this.state.frameworks.reduce((map, key) => Object.assign(map, { [key.toLowerCase()]: 1 }), {});
  }

  async templates() {
    await Promise.all([
      copyDir(this, this.templatePath('_root'), '.'),
      copyDir(this, this.templatePath('_scripts'), 'scripts'),
      this.state.frameworks.vue && copyDir(this, this.templatePath('_vue/scripts'), 'scripts'),
    ]);
    this.fs.extendJSON(this.destinationPath('package.json'), Object.assign({}, this.state.pkg, {
      name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
    }));
  }

  app() {
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('scripts'), this.destinationPath('scripts'));
    if (this.state.frameworks.vue) this.fs.copy(this.templatePath('_vue/demo'), this.destinationPath('src/demo-vue'));
    if (this.state.frameworks.react) this.fs.copy(this.templatePath('_react/demo'), this.destinationPath('src/demo-react'));
  }

  install() {
    const devDeps = [
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
    ];
    const deps = [
      // required by @babel/plugin-transform-runtime
      '@babel/runtime',
    ];
    if (this.state.frameworks.vue) {
      devDeps.push(
        'vue-loader',
        'vue-style-loader',
        'vue-template-compiler',
        'eslint-plugin-html',
      );
      deps.push(
        'vue',
      );
    } else {
      devDeps.push(
        'style-loader',
      );
    }
    if (this.state.frameworks.react) {
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

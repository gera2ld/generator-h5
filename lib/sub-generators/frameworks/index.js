const Generator = require('yeoman-generator');
const { replaceContent, install } = require('../../util');

module.exports = class FrameworkGenerator extends Generator {
  async prompting() {
    const answers = await this.prompt([
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
    this.state = answers;
    this.frameworks = this.state.frameworks.reduce((map, key) => Object.assign(map, { [key.toLowerCase()]: 1 }), {});
  }

  copy() {
    if (this.frameworks.vue) {
      this.fs.copy(this.templatePath('_vue/demo'), this.destinationPath('src/demo-vue'));
    }
    if (this.frameworks.react) {
      this.fs.copy(this.templatePath('_react/demo'), this.destinationPath('src/demo-react'));
    }
    if (this.frameworks.vue) {
      replaceContent(
        this,
        'scripts/webpack.base.conf.js',
        content => content
        .replace('/** WEBPACK_BASE_CONFIG **/', m => `\
  webpackUtil.vue(),
${m}`),
      );
    }
    replaceContent(
      this,
      'scripts/pages.conf.js',
      content => {
        if (this.frameworks.vue) {
          content = content.replace('/** PAGES **/', m => `\
  'demo-vue': {
    entry: './src/demo-vue',
    html: {
      title: 'Vue demo',
    },
  },
${m}`);
        }
        if (this.frameworks.react) {
          content = content.replace('/** PAGES **/', m => `\
  'demo-react': {
    entry: './src/demo-react',
    html: {
      title: 'React demo',
    },
  },
${m}`);
        }
        return content;
      },
    );
    if (this.frameworks.react) {
      replaceContent(
        this,
        '.babelrc.js',
        content => content.replace('/** BABEL_PRESETS **/', m => `
    // react
    ['@babel/preset-react', {
      pragma: 'React.createElement',
    }],
${m}`),
      );
    }
    replaceContent(
      this,
      '.eslintrc.js',
      eslint => {
        if (this.frameworks.react) {
          eslint = eslint
          .replace('/** ESLINT_EXTEND **/', m => `\
    require.resolve('webpack-util-react/eslint/react'),
${m}`);
        }
        if (this.frameworks.vue) {
          eslint = eslint
          .replace('/** ESLINT_EXTEND **/', m => `\
    require.resolve('webpack-util-vue/eslint/vue'),
${m}`);
        }
        return eslint;
      },
    );
  }

  install() {
    const devDeps = [];
    const deps = [];
    if (this.frameworks.vue) {
      deps.push(
        'vue',
      );
      devDeps.push(
        'webpack-util-vue',
      );
    }
    if (this.frameworks.react) {
      deps.push(
        'react',
        'react-dom',
        'raf',
      );
      devDeps.push(
        'webpack-util-react',
      );
    }
    install(this, devDeps, deps);
  }
}

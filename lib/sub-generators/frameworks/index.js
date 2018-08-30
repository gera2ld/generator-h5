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

  writing() {
    if (this.frameworks.vue) {
      this.fs.copyTpl(this.templatePath('_vue/scripts'), this.destinationPath('scripts'), this.state);
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
        .replace('style-loader', 'vue-style-loader')
        .replace('].reduce(', m => `\
  require('./webpack/vue')(),
${m}`),
      );
    }
    replaceContent(
      this,
      'scripts/pages.conf.js',
      content => {
        const pages = [];
        if (this.frameworks.vue) {
          pages.push(`\
  'demo-vue': {
    entry: './src/demo-vue',
    html: {
      title: 'Vue demo',
    },
  },`);
        }
        if (this.frameworks.react) {
          pages.push(`\
  'demo-react': {
    entry: './src/demo-react',
    html: {
      title: 'React demo',
    },
  },`);
        }
        if (pages.length) {
          content = content.replace(/};\s*$/, m => [...pages, m].join('\n'));
        }
        return content;
      },
    );
    if (this.frameworks.react) {
      replaceContent(
        this,
        '.babelrc',
        content => content.replace('"presets": [', m => `${m}
    "@babel/preset-react",`),
      );
    }
    replaceContent(
      this,
      '.eslintrc.js',
      eslint => {
        if (this.frameworks.react) {
          eslint = eslint
          .replace('airbnb-base', 'airbnb')
          .replace('rules: {', m => `${m}
    'react/jsx-filename-extension': 'off',`);
        }
        if (this.frameworks.vue) {
          eslint = eslint
          .replace('js: \'never\'', 'js: \'never\', vue: \'never\'')
          .replace('plugins: [],', `plugins: [
    // required to lint *.vue files
    'html',
  ],`);
        }
        return eslint;
      },
    );
  }

  install() {
    const devDeps = [];
    const deps = [];
    if (this.frameworks.vue) {
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
    if (this.frameworks.react) {
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
    install(this, devDeps, deps);
  }
}

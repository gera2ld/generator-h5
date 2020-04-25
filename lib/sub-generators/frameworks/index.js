const Generator = require('yeoman-generator');
const { replaceContent, replaceJSON, install } = require('../../util');

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
          'Svelte',
        ],
      },
    ]);
    this.state = answers;
    this.frameworks = this.state.frameworks.reduce((map, key) => Object.assign(map, { [key.toLowerCase()]: 1 }), {});
  }

  copy() {
    if (this.frameworks.vue) {
      this.fs.copy(this.templatePath('_vue/demo'), this.destinationPath('src/pages/demo-vue'));
    }
    if (this.frameworks.react) {
      this.fs.copy(this.templatePath('_react/demo'), this.destinationPath('src/pages/demo-react'));
    }
    replaceContent(
      this,
      'scripts/plaid.conf.js',
      content => {
        if (this.frameworks.vue) {
          content = content.replace('/** PAGES **/', m => `\
  'demo-vue': {
    html: {
      title: 'Vue demo',
    },
  },
${m}`);
        }
        if (this.frameworks.react) {
          content = content.replace('/** PAGES **/', m => `\
  'demo-react': {
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
        content => content.replace('/** BABEL_PRESETS **/', m => `\
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
    require.resolve('@gera2ld/plaid-react/eslint/react'),
${m}`);
        }
        if (this.frameworks.vue) {
          eslint = eslint
          .replace('/** ESLINT_EXTEND **/', m => `\
    require.resolve('@gera2ld/plaid-vue/eslint/vue'),
${m}`);
        }
        if (this.frameworks.svelte) {
          eslint = eslint
          .replace('/** ESLINT_EXTEND **/', m => `\
    require.resolve('@gera2ld/plaid-svelte/eslint/svelte'),
${m}`);
        }
        return eslint;
      },
    );
    replaceJSON(this, 'package.json', pkg => {
      const scripts = {
        ...pkg.scripts,
        lint: pkg.scripts.lint.replace(/--ext \S+/, m => `${m}${
          this.frameworks.vue ? ',.vue' : ''
        }${
          this.frameworks.svelte ? ',.svelte' : ''
        }`),
      };
      return {
        ...pkg,
        scripts,
      };
    });
  }

  install() {
    const devDeps = [];
    const deps = [];
    if (this.frameworks.vue) {
      deps.push(
        'vue',
      );
      devDeps.push(
        '@gera2ld/plaid-vue@~1.6.0',
      );
    }
    if (this.frameworks.react) {
      deps.push(
        'react',
        'react-dom',
        'raf',
      );
      devDeps.push(
        '@gera2ld/plaid-react@~1.6.0',
      );
    }
    if (this.frameworks.svelte) {
      devDeps.push(
        'svelte',
        '@gera2ld/plaid-svelte@~1.6.0',
      );
    }
    install(this, devDeps, deps);
  }
}

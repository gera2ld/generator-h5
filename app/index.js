const yeoman = require('yeoman-generator');

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

module.exports = yeoman.Base.extend({
  prompting() {
    function promptPreProcessors(answers) {
      const processors = [{
        name: 'None',
        value: '',
      }, {
        name: 'Less',
        value: 'less',
      }, {
        name: 'Sass',
        value: 'scss',
      }];
      return _this.prompt([{
        name: 'preProcessor',
        type: 'list',
        message: 'Which CSS pre-processor would you like to use?',
        choices: processors,
      }])
      .then(res => Object.assign(answers, res));
    }
    function promptCompatibility(answers) {
      return _this.prompt([{
        name: 'compatibility',
        type: 'list',
        message: 'How many browsers would you like to support for CSS?',
        choices: [{
          name: 'only the latest modern browsers',
          value: '',
        }, {
          name: 'include older browsers since IE 9',
          value: 'compatible',
        }],
      }])
      .then(res => Object.assign(answers, res));
    }
    const _this = this;
    return promptPreProcessors({
      utils,
    })
    .then(promptCompatibility)
    .then(answers => this.answers = answers);
  },
  lint() {
    this.template('_eslintrc.yml', '.eslintrc.yml');
  },
  packageJSON() {
    this.template('_package.json', 'package.json');
  },
  git() {
    this.template('_gitignore', '.gitignore');
    this.template('_git_prepush', '.git/hooks/prepush');
  },
  app() {
    // this.template('_env', '.env');
    this.template('gulpfile.js', this.answers);
    this.template('browserslist', this.answers);
    this.template('README.md');
    this.template('src/index.html');
    this.template('src/app.js');
    this.template('src/style.css', `src/style.${this.answers.preProcessor || 'css'}`);
    // this.directory('src');
    this.mkdir('src/assets');
  },
  install() {
    let deps = [
      'autoprefixer',
      'browser-sync',
      'del',
      'dotenv',
      'gulp',
      'gulp-cssnano',
      'gulp-eslint',
      'gulp-htmlmin',
      'gulp-plumber',
      'gulp-postcss',
      'gulp-uglify',
      'gulp-util',
      'gulp-assets-injector',
    ];
    if (this.answers.preProcessor === 'less') {
      deps = deps.concat([
        'gulp-less',
      ]);
    } else if (this.answers.preProcessor === 'scss') {
      deps = deps.concat([
        'gulp-sass',
      ]);
    }
    this.npmInstall(deps, {'save-dev': true});
  },
});

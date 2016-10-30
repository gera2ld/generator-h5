const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  prompting() {
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
    return this.prompt([{
      type: 'list',
      name: 'preProcessor',
      message: 'Which CSS pre-processor would you like to use?',
      choices: processors,
    }])
    .then(answers => {
      this.answers = answers;
    });
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

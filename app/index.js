const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
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
    this.template('gulpfile.js');
    this.template('README.md');
    this.directory('src');
    this.mkdir('src/assets');
  },
  install() {
    if (!this.options['skip-install']) {
      this.npmInstall([
        'autoprefixer',
        'browser-sync',
        'del',
        'dotenv',
        'gulp',
        'gulp-cssnano',
        'gulp-eslint',
        'gulp-htmlmin',
        'gulp-postcss',
        'gulp-rename',
        'gulp-sass',
        'gulp-uglify',
        'gulp-util',
      ], {'save-dev': true});
    }
  },
});

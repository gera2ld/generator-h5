require('dotenv').config({silent: true});
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');

const DIST = 'dist';
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

gulp.task('clean', () => del(DIST));

gulp.task('css', () => {
  return gulp.src('src/style.scss', {base: 'src'})
  .pipe(logError(sass({importer: importModuleSass})))
  .pipe(postcss([ autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }) ]))
  .pipe(rename(file => {
    file.basename = 'style';
  }))
  .pipe(gulp.dest(DIST))
  .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src('src/app.js')
  .pipe(gulp.dest(DIST));
});

gulp.task('html', () => {
  return gulp.src('src/index.html')
  .pipe(gulp.dest(DIST));
});

gulp.task('copy', () => {
  return gulp.src([
    'src/assets/**',
  ], {base: 'src'})
  .pipe(gulp.dest(DIST));
});

gulp.task('default', ['css', 'js', 'html', 'copy']);

gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**/*.scss', ['css']);
  gulp.watch('src/**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch('src/**/*.html', ['html']).on('change', browserSync.reload);
});

gulp.task('browser-sync', ['watch'], () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: DIST,
    },
  });
});

function importModuleSass(url, prev, done) {
  return {
    file: url.replace(/^~(\w.*)$/, (m, g) => path.resolve('node_modules', g)),
  };
}
function logError(stream) {
  return stream.on('error', function (err) {
    gutil.log(err);
    return this.emit('end');
  });
}

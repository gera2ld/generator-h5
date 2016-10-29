require('dotenv').config({silent: true});
const path = require('path');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const minifyHtml = require('gulp-htmlmin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

const DIST = 'dist';
const isProd = process.env.NODE_ENV === 'production';

gulp.task('clean', () => del(DIST));

gulp.task('css', () => {
  let stream = gulp.src('src/style.scss', {base: 'src'})
  .pipe(logError(sass({importer: importModuleSass})))
  .pipe(postcss([autoprefixer()]))
  .pipe(rename(file => {
    file.basename = 'style';
  }));
  if (isProd) stream = stream
  .pipe(cssnano());
  stream = stream
  .pipe(gulp.dest(DIST));
  if (!isProd) stream = stream
  .pipe(browserSync.stream());
  return stream;
});

gulp.task('js', () => {
  let stream = gulp.src('src/app.js');
  if (isProd) stream = stream
  .pipe(uglify());
  return stream
  .pipe(gulp.dest(DIST));
});

gulp.task('html', () => {
  let stream = gulp.src('src/index.html');
  if (isProd) stream = stream
  .pipe(minifyHtml({
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeAttributeQuotes: true,
  }));
  return stream
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

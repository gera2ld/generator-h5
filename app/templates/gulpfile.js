const path = require('path');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
<% if (es6) { -%>
const rollup = require('gulp-rollup');
const rollupOptions = {
  format: 'iife',
  plugins: [
    require('rollup-plugin-babel')({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-commonjs')({
      include: 'node_modules/**',
    }),
  ],
  allowRealFiles: true,
};
<% } -%>
const minifyHtml = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const assetsInjector = require('gulp-assets-injector')();
<% if (cssProcessor === 'less') { -%>
const less = require('gulp-less');
<% } else if (cssProcessor === 'scss') { -%>
const sass = require('gulp-sass');
<% } -%>

const DIST = 'dist';
const isProd = process.env.NODE_ENV === 'production';

gulp.task('clean', () => del(DIST));

gulp.task('css', () => {
  let stream = gulp.src('src/style.<%= cssProcessor || 'css' %>', {base: 'src'})
  .pipe(plumber(logError))
<% if (cssProcessor === 'less') { -%>
  .pipe(less())
<% } else if (cssProcessor === 'scss') { -%>
  .pipe(sass({importer: importModuleSass}))
<% } -%>
  .pipe(postcss([autoprefixer()]));
  if (isProd) stream = stream
  .pipe(cssnano());
  stream = stream
  .pipe(assetsInjector.collect());
  if (!isProd) stream = stream
  .pipe(gulp.dest(DIST));
  if (!isProd) stream = stream
  .pipe(browserSync.stream());
  return stream;
});

gulp.task('js', () => {
  let stream = gulp.src('src/app.js');
  <% if (es6) { -%>
  stream = stream.pipe(rollup(Object.assign({
    entry: 'src/app.js',
  }, rollupOptions)));
  <% } -%>
  if (isProd) stream = stream
  .pipe(uglify());
  stream = stream
  .pipe(assetsInjector.collect());
  if (!isProd) stream = stream
  .pipe(gulp.dest(DIST));
  return stream;
});

gulp.task('html', ['css', 'js'], () => {
  let stream = gulp.src('src/index.html')
  .pipe(assetsInjector.inject({link: !isProd}));
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

gulp.task('default', ['html', 'copy']);

gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**/*.<%= cssProcessor || 'css' %>', ['css']);
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

function logError(err) {
  gutil.log(err.toString());
  return this.emit('end');
}
<% if (cssProcessor === 'scss') { -%>
function importModuleSass(url, prev, done) {
  return {
    file: url.replace(/^~(\w.*)$/, (m, g) => path.resolve('node_modules', g)),
  };
}
<% } %>

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./scripts/webpack.conf');

const DIST = 'dist';

gulp.task('clean', () => del(DIST));

gulp.task('js-dev', cb => {
  let callback = cb;
  webpack(webpackConfig)
  .watch({}, (...args) => {
    webpackCallback(...args);
    reload();
    if (callback) {
      callback();
      callback = null;
    }
  });
});
gulp.task('js-prd', cb => {
  webpack(webpackConfig, (...args) => {
    webpackCallback(...args);
    cb();
  });
});

gulp.task('public', () => {
  return gulp.src('src/public/**', { base: 'src' })
  .pipe(gulp.dest(DIST));
});

gulp.task('watch', ['public'], () => {
  gulp.watch('src/public/**', ['public']);
});

gulp.task('build', ['js-prd']);

gulp.task('browser-sync', ['js-dev', 'watch'], () => {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: DIST,
    },
  });
});

function reload(done) {
  browserSync.reload();
  done && done();
}

function webpackCallback(err, stats) {
  if (err) {
    gutil.log('[FATAL]', err);
    return;
  }
  if (stats.hasErrors()) {
    gutil.log('[ERROR] webpack compilation failed\n', stats.toJson().errors.join('\n'));
    return;
  }
  if (stats.hasWarnings()) {
    gutil.log('[WARNING] webpack compilation has warnings\n', stats.toJson().warnings.join('\n'));
  }
  (Array.isArray(stats.stats) ? stats.stats : [stats])
  .forEach(stat => {
    const timeCost = (stat.endTime - stat.startTime) / 1000;
    const chunks = Object.keys(stat.compilation.namedChunks).join(' ');
    gutil.log(`Webpack built: [${timeCost.toFixed(3)}s] ${chunks}`);
  });
}

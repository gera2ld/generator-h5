const gulp = require('gulp');
const del = require('del');
const log = require('fancy-log');
const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./scripts/webpack.conf');

const DIST = 'dist';

function clean() {
  return del(DIST);
}

function jsDev(done) {
  let firstRun = true;
  webpack(webpackConfig)
  .watch({}, (...args) => {
    webpackCallback(...args);
    reload();
    if (firstRun) {
      firstRun = false;
      done();
    }
  });
}

function jsProd(done) {
  webpack(webpackConfig, (...args) => {
    webpackCallback(...args);
    done();
  });
}

function public() {
  return gulp.src('src/public/**', {
    base: 'src',
    since: gulp.lastRun(public),
  })
  .pipe(gulp.dest(DIST));
}

function watch() {
  gulp.watch('src/public/**', public);
}

function initBrowserSync(done) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: DIST,
    },
  }, () => done());
}

function reload() {
  browserSync.reload();
}

function webpackCallback(err, stats) {
  if (err) {
    log('[FATAL]', err);
    return;
  }
  if (stats.hasErrors()) {
    log('[ERROR] webpack compilation failed\n', stats.toJson().errors.join('\n'));
    return;
  }
  if (stats.hasWarnings()) {
    log('[WARNING] webpack compilation has warnings\n', stats.toJson().warnings.join('\n'));
  }
  (Array.isArray(stats.stats) ? stats.stats : [stats])
  .forEach(stat => {
    const timeCost = (stat.endTime - stat.startTime) / 1000;
    const chunks = Object.keys(stat.compilation.namedChunks).join(' ');
    log(`Webpack built: [${timeCost.toFixed(3)}s] ${chunks}`);
  });
}

exports.clean = clean;
exports.build = gulp.parallel(public, jsProd);
exports.browser = gulp.series(gulp.parallel(public, jsDev), initBrowserSync, watch);

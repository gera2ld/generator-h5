const gulp = require('gulp');
const fs = require('fs-extra');
const log = require('fancy-log');
const webpack = require('webpack');
const webpackConfig = require('./scripts/webpack.conf');
<% if (test) { -%>
const webpackTestConfig = require('./scripts/webpack.test.conf');
<% } -%>

const DIST = 'dist';
const PUBLIC = 'src/public';

function webpackCallback(done) {
  let firstTime = true;
  return (err, stats) => {
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
    if (firstTime) {
      firstTime = false;
      done(err);
    }
  }
}

function clean() {
  return fs.emptyDir(DIST);
}

function copyFiles() {
  return gulp.src([`${PUBLIC}/**`])
  .pipe(gulp.dest(DIST));
}

async function jsDev() {
  require('webpack-util/bin/develop')([]);
}

function jsProd(done) {
  const compiler = webpack(webpackConfig);
  compiler.run(webpackCallback(done));
}

<% if (test) { -%>
function jsTest(done) {
  const compiler = webpack(webpackTestConfig);
  compiler.run(webpackCallback(done));
}

<% } -%>
exports.clean = clean;
exports.dev = gulp.parallel(copyFiles, jsDev);
exports.build = gulp.series(clean, gulp.parallel(copyFiles, jsProd));
<% if (test) { -%>
exports.buildTest = jsTest;
<% } -%>
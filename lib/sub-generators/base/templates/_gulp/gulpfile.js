const fs = require('fs-extra');
const gulp = require('gulp');

const DIST = 'dist';

function clean() {
  return fs.emptyDir(DIST);
}

async function jsDev() {
  require('@gera2ld/plaid-webpack/bin/develop')();
}

async function jsProd() {
  return require('@gera2ld/plaid-webpack/bin/build')({
    api: true,
    keep: true,
  });
}

exports.dev = jsDev;
exports.build = gulp.series(clean, jsProd);

async function jsDev() {
  require('@gera2ld/plaid/bin/develop')();
}

async function jsProd() {
  return require('@gera2ld/plaid/bin/build')({
    api: true,
  });
}

exports.dev = jsDev;
exports.build = jsProd;

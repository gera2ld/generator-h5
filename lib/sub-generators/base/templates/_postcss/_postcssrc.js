const { combineConfigSync } = require('@gera2ld/plaid/util');
const precss = require('@gera2ld/plaid/postcss/precss');
const px2rem = require('@gera2ld/plaid/postcss/px2rem');

module.exports = combineConfigSync({}, [precss, px2rem]);

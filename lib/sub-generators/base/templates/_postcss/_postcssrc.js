const { combineConfigSync } = require('webpack-util/util');
const precss = require('webpack-util/postcss/precss');

module.exports = combineConfigSync({}, [precss]);

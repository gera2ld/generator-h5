const { isProd, styleLoader } = require('./utils');

module.exports = {
  preserveWhitespace: false,
  loaders: {
    css: styleLoader(),
  },
};

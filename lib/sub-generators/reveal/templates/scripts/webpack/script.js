const { resolve } = require('../util');

module.exports = () => config => {
  config.module = {
    ...config.module,
  };
  config.module.rules = [
    ...config.module.rules || [],
    {
      test: /\.js$/,
      use: 'script-loader',
      include: [resolve('node_modules/reveal.js/plugin')],
    },
  ];
};

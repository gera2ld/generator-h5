const path = require('path');

module.exports = config => {
  config.module = {
    ...config.module,
  };
  config.module.rules = [
    ...config.module.rules || [],
    {
      test: /\.js$/,
      use: 'script-loader',
      include: [path.resolve('node_modules/reveal.js/plugin')],
    },
  ];
};

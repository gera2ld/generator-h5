const baseConfig = [
  require('./webpack/common')({
    style: {
      fallback: 'style-loader',
    },
  }),
  require('./webpack/url')(),
  <%= features.includes('svg') ? '' : '// ' %>require('./webpack/svg')(),
  // require('./webpack/raw')(),
  // require('./webpack/sw')(),
].reduce(
  (config, apply) => (apply && apply(config) || config),
  {},
);

module.exports = baseConfig;

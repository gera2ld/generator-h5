const baseConfig = [
  require('./webpack/common')({
    style: {
      fallback: 'style-loader',
    },
  }),
  require('./webpack/url')(),
  require('./webpack/raw')(),
  require('./webpack/svg')(),
  <%= features.includes('sw') ? '' : '// ' %>require('./webpack/sw')(),
].reduce(
  (config, apply) => (apply && apply(config) || config),
  {},
);

module.exports = baseConfig;

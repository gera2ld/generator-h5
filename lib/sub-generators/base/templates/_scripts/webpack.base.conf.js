const baseConfig = [
  require('./webpack/common'),
  require('./webpack/url'),
  <%= features.includes('svg') ? '' : '// ' %>require('./webpack/svg'),
  // require('./webpack/raw'),
].reduce(
  (config, apply) => (apply && apply(config) || config),
  {},
);

module.exports = baseConfig;

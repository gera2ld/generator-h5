const baseConfig = [
  require('./webpack/common'),
  require('./webpack/url'),
  <%= features.includes('svg') ? '' : '// ' %>require('./webpack/svg'),
  <%= features.includes('inline') ? '' : '// ' %>require('./webpack/inline'),
  // require('./webpack/raw'),
].reduce(
  (config, apply) => (apply && apply(config) || config),
  {},
);

module.exports = baseConfig;

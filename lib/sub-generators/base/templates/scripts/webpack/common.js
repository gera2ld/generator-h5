const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const { isProd, styleRule, resolve } = require('../util');

const defaultStyleOptions = {
  loaders: ['postcss-loader'],
};

module.exports = config => {
  config.mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  config.output = {
    ...config.output,
    path: resolve('dist'),
    publicPath: '',
    filename: '[name].js',
  };
  config.resolve = {
    ...config.resolve,
    // Tell webpack to look for peer dependencies in `node_modules`
    // when packages are linked from outside directories
    modules: [resolve('node_modules')],
    extensions: ['.js'],
    alias: {
      '#': resolve('src'),
    },
  },
  config.module = {
    ...config.module,
  };
  config.module.rules = [
    ...config.module.rules || [],
    {
      test: /\.js$/,
      use: 'babel-loader',
      include: [resolve('src'), resolve('test')],
    },
    // CSS modules: src/**/*.module.css
    styleRule({ ...defaultStyleOptions, modules: true }, {
      test: /\.module\.css$/,
      exclude: [resolve('node_modules')],
    }),
    // normal CSS files: src/**/*.css
    styleRule({ ...defaultStyleOptions }, {
      exclude: [
        /\.module\.css$/,
        resolve('node_modules'),
      ],
    }),
    // library CSS files: node_modules/**/*.css
    styleRule({}, {
      include: [resolve('node_modules')],
    }),
  ];
  config.plugins = [
    ...config.plugins || [],
    isProd && new MiniCssExtractPlugin(),
    isProd && new OptimizeCssnanoPlugin({
      cssnanoOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
  ].filter(Boolean);
};

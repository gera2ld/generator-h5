const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
<% if (vue) { -%>
const vueLoaderConfig = require('./vue-loader.conf');
<% } -%>
const { isDev, isProd, styleRule } = require('./utils');

const DIST = 'dist';
// const extractSVG = isProd;

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});

const defaultStyleOptions = {
<% if (vue) { -%>
  fallback: 'vue-style-loader',
<% } -%>
  loaders: ['postcss-loader'],
};

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  output: {
    path: resolve(DIST),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    // Tell webpack to look for peer dependencies in `node_modules`
    // when packages are linked from outside directories
    modules: [resolve('node_modules')],
    extensions: ['.js'<% if (vue) { %>, '.vue'<% } %>],
    alias: {
      '#': resolve('src'),
    }
  },
  module: {
    rules: [
<% if (vue) { -%>
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
<% } -%>
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        }],
        exclude: [resolve('src/resources/icons')],
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'svg-sprite-loader',
          options: {
            // extract: extractSVG,
          },
        }],
        include: [resolve('src/resources/icons')],
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
      Object.assign(styleRule(), {
        include: [resolve('node_modules')],
      }),
    ],
  },
  // cheap-module-eval-source-map is faster for development
  devtool: isDev ? '#inline-source-map' : false,
  plugins: [
    definePlugin,
    isProd && new MinifyPlugin(),
    isProd && new ExtractTextPlugin('[name].css'),
    // extractSVG && new SpriteLoaderPlugin(),
  ].filter(Boolean),
};

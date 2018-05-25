const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
<% if (frameworks.vue) { -%>
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const vueLoaderConfig = require('./vue-loader.conf');
<% } -%>
const { isDev, isProd, styleRule } = require('./utils');

const DIST = 'dist';
// const extractSVG = isProd;
<%
// const definePlugin = new webpack.DefinePlugin({
//   'process.env': {
//   },
// });
%>
const defaultStyleOptions = {
  loaders: ['postcss-loader'],
};

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  mode: process.env.NODE_ENV,
  output: {
    path: resolve(DIST),
    publicPath: '',
    filename: '[name].js',
  },
  resolve: {
    // Tell webpack to look for peer dependencies in `node_modules`
    // when packages are linked from outside directories
    modules: [resolve('node_modules')],
    extensions: ['.js'<% if (frameworks.vue) { %>, '.vue'<% } %>],
    alias: {
      '#': resolve('src'),
    },
  },
  module: {
    rules: [
<% if (frameworks.vue) { -%>
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
  plugins: [
<% if (frameworks.vue) { -%>
    new VueLoaderPlugin(),
<% } -%>
    isProd && new MiniCssExtractPlugin(),
    // extractSVG && new SpriteLoaderPlugin(),
  ].filter(Boolean),
};

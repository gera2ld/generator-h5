const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
<% if (vue) { -%>
const vueLoaderConfig = require('./vue-loader.conf');
<% } -%>
const { IS_DEV, styleRule } = require('./utils');

const DIST = 'dist';

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});

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
      src: resolve('src'),
    }
  },
  node: {
    // css-loader requires unnecessary `Buffer` polyfill,
    // which increases the bundle size significantly.
    // See:
    // - https://github.com/webpack-contrib/css-loader/issues/454
    // - https://github.com/vuejs/vue-loader/issues/720
    Buffer: false,
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
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          },
        }],
      },
<% if (vue) { -%>
      styleRule({
        fallback: 'vue-style-loader',
        loaders: ['postcss-loader'],
      }),
<% } else { -%>
      // CSS modules: src/**/*.module.css
      Object.assign(styleRule({ loaders: ['postcss-loader'], modules: true }), {
        test: /\.module\.css$/,
        exclude: [resolve('node_modules')],
      }),
      // normal CSS files: src/**/*.css
      Object.assign(styleRule({ loaders: ['postcss-loader'] }), {
        exclude: [
          /\.module\.css$/,
          resolve('node_modules'),
        ],
      }),
      // library CSS files: node_modules/**/*.css
      Object.assign(styleRule(), {
        include: [resolve('node_modules')],
      }),
<% } -%>
    ],
  },
  // cheap-module-eval-source-map is faster for development
  devtool: IS_DEV ? '#inline-source-map' : false,
  plugins: [
    definePlugin,
    !IS_DEV && new MinifyPlugin({
      builtIns: false,
    }),
  ].filter(Boolean),
};

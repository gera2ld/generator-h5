const ExtractTextPlugin = require('extract-text-webpack-plugin');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

function styleLoader(options) {
  const {
    loaders = [],
    extract = isProd,
    minimize = isProd,
    fallback = 'style-loader',
    modules = false,
  } = options || {};
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize,
      modules,
      importLoaders: 1,
      sourceMap: false,
    },
  };
  return extract ? ExtractTextPlugin.extract({
    fallback,
    use: [cssLoader, ...loaders],
  }) : [
    fallback,
    cssLoader,
    ...loaders,
  ];
}

function styleRule(options, rule) {
  return {
    test: /\.css$/,
    use: styleLoader(options),
    ...rule,
  };
}

function merge(obj1, obj2, deep = true) {
  if (!obj2) return obj1;
  if (Array.isArray(obj1)) return obj1.concat(obj2);
  const obj = Object.assign({}, obj1);
  Object.keys(obj2).forEach(key => {
    if (typeof obj[key] === 'object' && deep) {
      obj[key] = merge(obj[key], obj2[key]);
    } else {
      obj[key] = obj2[key];
    }
  });
  return obj;
}

exports.isDev = isDev;
exports.isProd = isProd;
exports.styleLoader = styleLoader;
exports.styleRule = styleRule;
exports.merge = merge;

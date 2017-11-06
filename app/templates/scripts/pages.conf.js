/**
 * For each entry, `key` is the chunk name,
 * `value.entry` is the webpack entry,
 * `value.html` is the options object passed to HtmlWebpackPlugin.
 */

module.exports = {
  index: {
    entry: 'src/index',
    html: {
      title: 'Hello, world',
    },
  },
};

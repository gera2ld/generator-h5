/**
 * For each entry, `key` is the chunk name, `value` has following properties:
 * - value.entry: webpack entry.
 * - value.html: options object passed to HtmlWebpackPlugin.
 *   - value.html.inlineSource: if true, JS and CSS files will be inlined in HTML.
 */

module.exports = {
  index: {
    entry: './src/index',
    html: {
      title: 'Hello, world',
    },
  },
/** PAGES **/
};

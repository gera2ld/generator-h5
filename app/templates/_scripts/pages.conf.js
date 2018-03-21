/**
 * For each entry, `key` is the chunk name,
 * `value.entry` is the webpack entry,
 * `value.html` is the options object passed to HtmlWebpackPlugin.
 */

module.exports = {
  index: {
    entry: './src/index',
    html: {
      title: 'Hello, world',
    },
  },
<% if (frameworks.vue) { -%>
  'demo-vue': {
    entry: './src/demo-vue',
    html: {
      title: 'Vue demo',
    },
  },
<% } -%>
<% if (frameworks.react) { -%>
  'demo-react': {
    entry: './src/demo-react',
    html: {
      title: 'React demo',
    },
  },
<% } -%>
};

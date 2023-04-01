const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/polyfill',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'eruda-polyfill.js',
  },
}

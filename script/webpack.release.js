var webpack = require('webpack')

exports = require('./webpack.base')

exports.output.filename = 'eruda.min.js'
exports.devtool = false
exports.plugins = exports.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    comments: /eruda/
  }),
  new webpack.DefinePlugin({
    ENV: '"production"'
  })
])

module.exports = exports

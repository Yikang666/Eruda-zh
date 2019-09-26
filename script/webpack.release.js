const webpack = require('webpack')

exports = require('./webpack.base')

exports.output.filename = 'eruda.js'
exports.devtool = 'source-map'
exports.plugins = exports.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    },
    output: {
      ascii_only: true
    },
    comments: /eruda v/
  }),
  new webpack.DefinePlugin({
    ENV: '"production"'
  })
])

module.exports = exports

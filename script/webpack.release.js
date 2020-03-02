const webpack = require('webpack')

exports = require('./webpack.base')

exports.mode = 'production'
exports.output.filename = 'eruda.js'
exports.devtool = 'source-map'
exports.plugins = exports.plugins.concat([
  new webpack.DefinePlugin({
    ENV: '"production"'
  })
])

module.exports = exports

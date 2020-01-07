const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

exports = require('./webpack.release')

exports.plugins.push(new BundleAnalyzerPlugin())

module.exports = exports

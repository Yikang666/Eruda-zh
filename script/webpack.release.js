var webpack = require('webpack');

exports = require('./webpack.dev');

exports.output.filename = 'eruda.min.js';
exports.devtool = false;
exports.plugins = exports.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: /eruda/
    }),
    new webpack.optimize.DedupePlugin()
]);

module.exports = exports;
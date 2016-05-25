var autoprefixer = require('autoprefixer'),
    classPrefix = require('postcss-class-prefix'),
    path = require('path');

var nodeModDir = path.resolve('./node_modules/') + '/';

module.exports = {
    entry: './src/index.es6',
    output: {
        path: __dirname + '/dist/',
        filename: 'eruda.js',
        library: ['eruda'],
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css', 'postcss']
            },
            // https://github.com/wycats/handlebars.js/issues/1134
            {
                test: /\.hbs$/,
                loader: nodeModDir + 'handlebars-loader/index.js',
                query: {
                    runtime: nodeModDir + 'handlebars/dist/handlebars.runtime.js'
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    postcss: function ()
    {
        return [classPrefix('eruda-'), autoprefixer];
    }
};
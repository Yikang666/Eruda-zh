var autoprefixer = require('autoprefixer'),
    classPrefix = require('postcss-class-prefix'),
    webpack = require('webpack'),
    pkg = require('../package.json'),
    path = require('path');

var nodeModDir = path.resolve('./node_modules/') + '/',
    banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage;

module.exports = {
    devtool: false,
    entry: './src/index.es6',
    devServer: {
        contentBase: './test',
        port: 3000
    },
    output: {
        path: path.resolve(__dirname, '../'),
        publicPath: "/assets/",
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
                loaders: ['css', 'postcss', 'sass']
            },
            {
                test: /\.css$/,
                loaders: ['css', 'postcss']
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
    plugins: [
        new webpack.BannerPlugin(banner)
    ],
    postcss: function ()
    {
        return [classPrefix('eruda-'), autoprefixer];
    }
};
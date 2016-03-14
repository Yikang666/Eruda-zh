var autoprefixer = require('autoprefixer'),
    classPrefix = require('postcss-class-prefix');

module.exports = {
    entry: './src/index.es6',
    output: {
        path: __dirname + '/dist/',
        filename: 'eruda.js',
        library: ['eruda']
    },
    module: {
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel?presets[]=es2015'
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
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
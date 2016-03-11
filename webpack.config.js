var autoprefixer = require('autoprefixer'),
    precss = require('precss');

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
        return [autoprefixer, precss];
    }
};
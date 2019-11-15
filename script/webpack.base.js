const autoprefixer = require('autoprefixer')
const prefixer = require('postcss-prefixer')
const clean = require('postcss-clean')
const webpack = require('webpack')
const pkg = require('../package.json')
const path = require('path')

process.traceDeprecation = true

const nodeModDir = path.resolve('./node_modules/') + '/'
const srcDir = path.resolve('./src') + '/'
const banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      prefixer({
        prefix: 'eruda-'
      }),
      autoprefixer,
      clean()
    ]
  }
}

module.exports = {
  entry: './src/index',
  devServer: {
    contentBase: './test',
    port: 3000
  },
  output: {
    path: path.resolve(__dirname, '../'),
    publicPath: '/assets/',
    library: 'eruda',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /Worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            fallback: false,
            name: '[name].js'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules|index\.js/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          },
          'eslint-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: ['css-loader', postcssLoader, 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['css-loader', postcssLoader]
      },
      // https://github.com/wycats/handlebars.js/issues/1134
      {
        test: /\.hbs$/,
        use: [
          {
            loader: nodeModDir + 'handlebars-loader/index.js',
            options: {
              runtime: srcDir + 'lib/handlebars.js'
            }
          },
          {
            loader: 'html-minifier-loader',
            options: {
              ignoreCustomFragments: [/\{\{\{[^}]+\}\}\}/, /\{\{[^}]+\}\}/]
            }
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.DefinePlugin({
      VERSION: '"' + pkg.version + '"'
    })
  ]
}

const path = require('path');
const webpack = require('webpack');

// Plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.join(__dirname, '..');
const appPath = path.join(rootPath, 'app');
const distPath = path.join(rootPath, 'dist');

module.exports = ({
  isProd = false,
  isWebpackDevServer = false,
  bail = false
} = {}) => ({
  bail,
  devtool: 'source-map',
  entry: {
    [`app${isProd ? '.min' : ''}`]: (
      isWebpackDevServer ? ['webpack-hot-middleware/client'] : []
    ).concat(path.join(appPath, 'index.js'))
  },
  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: ''
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: isWebpackDevServer,
      allChunks: true
    }),
    new webpack.DefinePlugin({
      __PROD__: JSON.stringify(isProd),
      __DEV__: JSON.stringify(!isProd),
      __DEVSERVER__: JSON.stringify(isWebpackDevServer),
      'process.env': {
        NODE_ENV: JSON.stringify(isProd ? 'production' : 'development')
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(appPath, 'index.html'),
      inject: 'head'
    }),
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    })
  ]
  .concat(isWebpackDevServer ? [
    new webpack.HotModuleReplacementPlugin()
  ] : [])
  .concat(isProd ? [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ] : []),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2']
            }
          }
        ]
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2', 'react'].concat(isWebpackDevServer ? ['react-hmre'] : [])
            }
          }
        ]
      }, {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2', 'react'].concat(isWebpackDevServer ? ['react-hmre'] : [])
            }
          }, {
            loader: 'react-svg-loader'
          }
        ]
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            }
          ],
          fallback: 'style-loader'
        })
      }, {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './font/[hash].[ext]',
              mimetype: 'application/font-woff'
            }
          }
        ]
      }, {
        test: /\.(ttf|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './font/[hash].[ext]'
            }
          }
        ]
      }, {
        test: /\.(gif|png|jpeg|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './asset/[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      rootPath,
      path.join(rootPath, 'node_modules')
    ]
  }
});

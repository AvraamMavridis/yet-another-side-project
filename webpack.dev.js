var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');


module.exports = function (env) {
  return {
    devtool: 'source-map',
    entry: [
       './src/index'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/dist/'
    },
    plugins: [
      new WriteFilePlugin(),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, 'src/sw.js'),
          to: path.join(__dirname, 'dist/sw.js'),
        }
      ]),
      new HtmlWebpackPlugin({template: './index.html'}),
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin({filename: 'app.css', disable: false, allChunks: true}),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'webpack-report.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'webpack-stats.json',
        logLevel: 'info'
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      clientLogLevel: 'info'
    },
    stats: {
      // Remove built modules information.
      modules: true,
      // Remove built modules information to chunk information.
      chunkModules: true,
      colors: true
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: [
            'react-hot-loader', 'babel-loader'
          ],
          include: path.join(__dirname, 'src')
        }, {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64' +
                ':5]'
          })
        }, {
          test: /\.scss$/,
          loader: 'style-loader?sourceMap!css-loader?modules&importLoaders=1&localIdentName=[name]_' +
              '_[local]___[hash:base64:5]!sass-loader'
        }, {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }

        }
      ]
    },
    'resolve': {
      'alias': {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
      }
    }
  }
};
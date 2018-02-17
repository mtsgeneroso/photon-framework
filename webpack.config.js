'use strict';

/* eslint-env node */
var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');

var entry = [
  './src/index.js'
];
var basePlugins = [
  new StyleLintPlugin({
    configFile: path.join(__dirname, './.stylelintrc.json')
  })
];

var jsLoaders = ['babel?presets[]=es2015'];
var cssLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader');
var plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins = basePlugins.concat([
    new ExtractTextPlugin('photon.css', {
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      process: {env: {NODE_ENV: '"production"'}}
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]);
} else {
  entry = ['webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server'].concat(entry);
  plugins = basePlugins.concat([
    new webpack.DefinePlugin({
      process: {env: {NODE_ENV: '"development"'}}
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new DashboardPlugin()
  ]);
  cssLoader = 'style!css!sass';
}

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'photon.js'
  },
  plugins: plugins,
  module: {
    preLoaders: [{
      test: /\.js?$/,
      loader: 'eslint',
      exclude: /node_modules/
    }],
    loaders: [,{
      test: /\.(svg|png)$/,
      loader: 'file'
    },{
      test: /\.s?css$/,
      loader: cssLoader
    }]
  }
};
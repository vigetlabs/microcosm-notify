var path = require('path')
var Webpack = require('webpack')
var baseConfig = require('./webpack.base')
var merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, 'examples'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      'microcosm-notify': path.resolve(__dirname, '../src/index')
    }
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'examples'),
    publicPath: '/',
    port: 3000,
    quiet: false,
    noInfo: false
  }
})

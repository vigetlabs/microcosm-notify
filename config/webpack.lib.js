var path = require('path')
var Webpack = require('webpack')
var baseConfig = require('./webpack.base')
var merge = require('webpack-merge')
var libraryName = 'microcosm-notify'
var outputFile = libraryName + '.js'

module.exports = merge(baseConfig, {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: outputFile,
    library: libraryName
  }
})

var Webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: 'node_modules/.cache/babel-cache'
            }
          }
        ]
      },
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new Webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development'
    })
  ]
}

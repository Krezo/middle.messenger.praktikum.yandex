const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { ProvidePlugin } = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    static: './dist',
    historyApiFallback: {
      index: '/index.html',
    },
  },
})

const { merge } = require('webpack-merge')
const dev = require('./webpack.dev.js')

module.exports = merge(dev, {
  devServer: {
    hot: true,
  },
})

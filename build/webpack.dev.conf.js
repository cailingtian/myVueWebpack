const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge(webpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    progress: true,
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ]
})
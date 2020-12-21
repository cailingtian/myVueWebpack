const path = require('path');
const Webpack = require('webpack')

// 抽离不常变更的第三方模块额外进行打包
module.exports = {
  entry: {
   vendor: ['vue']
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    library: '[name]_library',
    filename: '[name].dll.js'
  },
  plugins: [
    new Webpack.DllPlugin({
      path: path.join(__dirname, '../', '[name]-mainfest.json'),
      name: '[name]_library',
    })
  ]
}
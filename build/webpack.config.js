const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const Webpack = require('webpack')
// const CopyPlugin = require('copy-webpack-plugin')
const devMode = process.env.NODE_ENV === 'production' ? false : true
const HappyPack = require('happypack') // 多个子进程并行处理文件
const os = require('os')
const HappyPackThreadTool = new HappyPack.ThreadPool({
  size: os.cpus().length
})
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    main: path.resolve(__dirname,'../src/main.js')
  },
  output: {
    path: path.resolve(__dirname,'../dist'),
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'happypack/loader?id=happyBabel'
        },
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            },
          }
        }],
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.css$/i,
        use: ['vue-style-loader', {
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        }, 'css-loader', 'postcss-loader'],
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.less$/i,
        use: ['vue-style-loader', {
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        }, 'css-loader', 'less-loader', 'postcss-loader'],
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.(jep?g|png|gif)$/,
        use:{
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]',
              }
            }
          }
        },
        include: [path.resolve(__dirname, 'src/assets')],
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[hash:8].[ext]',
              }
            },
          }
        },
        include: [path.resolve(__dirname, 'src/assets')],
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          }
        },
        include: [path.resolve(__dirname, 'src/assets')],
        exclude: [path.resolve(__dirname, 'node_modules')]
      }, 
      {
        test: /\.ext$/,  // 缓存
        use: [
          'cache-loader'
        ],
        include: [path.resolve(__dirname, 'src')],
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      ' @': path.resolve(__dirname,'../src')
    },
    extensions: ['*','.js','.json','.vue']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'../src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : 'css/[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : 'css/[id].[hash].css'
    }),
    new HappyPack({
      id: 'happyBabel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ]
          },
          cacheDirectory: true
        }
      ],
      threadPool: HappyPackThreadTool // 共享进程池
    }),
    // 抽离第三方库
    // new Webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('../vendor-manifest.json')
    // }),
    // new CopyPlugin([{
    //   patterns:[
    //     { 
    //       from: path.resolve(__dirname, '../static'),
    //       to: path.resolve(__dirname, '../dist')
    //     }
    //   ]
    // }]),
    new vueLoaderPlugin(),
    new BundleAnalyzerPlugin({
      analyzerHost: '127.0.0.1',
      analyzerPort: '8099'
    })
  ]
}
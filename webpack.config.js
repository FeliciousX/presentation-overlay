const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HTMLWebpackPlugin({template: './src/index.html'})
  ],
  devtool: 'source-map'
}

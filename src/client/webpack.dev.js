const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../../dist/client'),
    },
    hot: true,
    port: 9000,
  },
});

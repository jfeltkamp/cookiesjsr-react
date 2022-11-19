var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'cookiesjsr-preloader.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-classes']
          }
        }
      }
    ]
  },
  devtool: 'source-map'
};

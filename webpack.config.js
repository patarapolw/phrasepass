const webpack = require('webpack');
const path = require('path');

const config = {
  mode: "none",
  entry: './src/index.ts',
  output: {
    path: __dirname,
    filename: 'app.min.js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  }
}

module.exports = config;
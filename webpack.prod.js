const Merge = require("webpack-merge");
const Dotenv = require("dotenv-webpack");

const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const commonConfig = require("./webpack.config");

module.exports = () =>
  Merge(commonConfig, {
    devtool: "cheap-module-source-map",
    plugins: [
      new Dotenv({
        path: "./prod.env",
        systemvars: true // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      }),
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8,
        filename: "[path].gz[query]"
      })
    ],
    devServer: {
      contentBase: "./dist",
      historyApiFallback: {
        index: "/"
      }
    }
  });

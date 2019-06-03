const Merge = require("webpack-merge");
const Dotenv = require("dotenv-webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");
const commonConfig = require("./webpack.config");

module.exports = () =>
  Merge(commonConfig, {
    devtool: "inline-source-map",
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      progress: true
    },
    plugins: [
      new Dotenv({
        path: "./dev.env",
        systemvars: true // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerHost: "127.0.0.1",
        analyzerPort: 8888
      }),
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8
      }),
    ]
  });

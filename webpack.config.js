const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { VueLoaderPlugin } = require("vue-loader");
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (_, argv) => ({
  output: {
    publicPath: argv.mode === "development"
      ? "http://localhost:8083/"
      : "https://federated-host.vercel.app/",
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },

  resolve: {
    extensions: [".tsx", ".ts", ".vue", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8083,
    historyApiFallback: true,
    hot: true, // Enable Hot Module Replacement
    open: true,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '_',
      minSize: 30000,
      maxSize: 500000,
    },
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 500000, // 500 KB
    maxEntrypointSize: 1000000, // 1 MB
  },

  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        emailList: argv.mode === "development"
          ? "emailList@http://localhost:8084/emailList.js"
          : "emailList@https://federated-email-list.vercel.app/emailList.js",
        selectedList: argv.mode === "development"
          ? "selectedList@http://localhost:8085/selectedList.js"
          : "selectedList@https://federated-selected-list.vercel.app/selectedList.js",
      },
      exposes: {},
      shared: {
        vue: { singleton: true, eager: false },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv(),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
    }),
  ],
});

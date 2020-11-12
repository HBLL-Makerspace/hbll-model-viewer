const path = require("path");
// let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./src/hbll-model-viewer.ts",
  devtool: "inline-source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
  },
};

const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const CopyPlugin = require("copy-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    entry: ["./src/app.scss"],
    output: {
      filename: "style-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "bundle.css",
              },
            },
            { loader: "extract-loader" },
            { loader: "css-loader" },
            {
              loader: "sass-loader",
              options: {
                // Prefer Dart Sass
                implementation: require("sass"),

                // See https://github.com/webpack-contrib/sass-loader/issues/804
                webpackImporter: false,
                sassOptions: {
                  includePaths: ["./node_modules"],
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    entry: "./src/hbll-model-viewer.ts",
    devtool: "inline-source-map",
    // mode: "production",
    devServer: {
      port: 8080, // Specify a port number to listen for requests
    },
    resolve: {
      fallback: { stream: require.resolve("stream-browserify") },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$|\.s(c|a)ss$/,
          use: [
            {
              loader: "lit-scss-loader",
              options: {
                minify: true, // defaults to false
              },
            },
            "extract-loader",
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(),
      // new copyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: "./src/editor.md/lib",
      //       to: path.resolve(__dirname, "dist/lib"),
      //     },
      //   ],
      // }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "hbll-model-viewer.min.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
];

const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
// let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = [
  // {
  //   entry: "./src/app.scss",
  //   output: {
  //     // This is necessary for webpack to compile
  //     // But we never use style-bundle.js
  //     filename: "style-bundle.js",
  //   },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.scss$/,
  //         use: [
  //           {
  //             loader: "file-loader",
  //             options: {
  //               name: "bundle.css",
  //             },
  //           },
  //           { loader: "extract-loader" },
  //           { loader: "css-loader" },
  //           {
  //             loader: "postcss-loader",
  //             options: {
  //               postcssOptions: {
  //                 plugins: () => [autoprefixer()],
  //               },
  //             },
  //           },
  //           {
  //             loader: "sass-loader",
  //             options: {
  //               sassOptions: {
  //                 includePaths: ["./node_modules"],
  //               },
  //               // Prefer Dart Sass
  //               implementation: require("sass"),

  //               // See https://github.com/webpack-contrib/sass-loader/issues/804
  //               webpackImporter: false,
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
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
    plugins: [new HtmlWebpackPlugin()],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "hbll-model-viewer.min.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
];

/*
 * Author: Ben Brenkman
 */

const { nodeResolve: resolve } = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const cleanup = require("rollup-plugin-cleanup");
const { terser } = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");
const polyfill = require("rollup-plugin-polyfill");

const { NODE_ENV } = process.env;

const onwarn = (warning, warn) => {
  // Suppress non-actionable warning caused by TypeScript boilerplate:
  if (warning.code !== "THIS_IS_UNDEFINED") {
    warn(warning);
  }
};

let plugins = [
  resolve({ dedupe: ["three"] }),
  replace({ "Reflect.decorate": "undefined" }),
];

const watchFiles = ["lib/**", "../3dom/lib/**"];

const outputOptions = [
  {
    input: "./src/hbll-model-viewer.ts",
    output: {
      file: "./dist/hbll-model-viewer.js",
      sourcemap: true,
      format: "esm",
      name: "ModelViewerElement",
    },
    watch: {
      include: watchFiles,
    },
    plugins,
    onwarn,
  },
];

if (NODE_ENV !== "development") {
  const pluginsIE11 = [
    ...plugins,
    commonjs(),
    polyfill(["object.values/auto"]),
    cleanup({
      // Ideally we'd also clean third_party/three, which saves
      // ~45kb in filesize alone... but takes 2 minutes to build
      include: ["lib/**"],
      comments: "none",
    }),
  ];

  // IE11 does not support modules, so they are removed here, as well as in a
  // dedicated unit test build which is needed for the same reason.
  outputOptions.push({
    input: "./src/hbll-model-viewer.ts",
    output: {
      file: "./dist/hbll-model-viewer-umd.js",
      sourcemap: true,
      format: "umd",
      name: "ModelViewerElement",
    },
    watch: {
      include: watchFiles,
    },
    plugins: pluginsIE11,
    onwarn,
  });

  plugins = [...plugins, terser()];

  outputOptions.push({
    input: "./dist/hbll-model-viewer.js",
    output: {
      file: "./dist/hbll-model-viewer.min.js",
      sourcemap: true,
      format: "esm",
      name: "ModelViewerElement",
    },
    watch: {
      include: watchFiles,
    },
    plugins,
    onwarn,
  });
}

export default outputOptions;

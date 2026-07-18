import path from "node:path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import {
  moduleRules,
  projectPaths,
  resolveExtensions,
  sharedDependencies,
} from "./webpack.shared.mjs";

const { ModuleFederationPlugin } = webpack.container;

export default (_environment, argumentsObject) => {
  const production = argumentsObject.mode === "production";
  const remoteLocation = production
    ? "keybridgeRemote@/remote/remoteEntry.js"
    : "keybridgeRemote@http://localhost:3001/remoteEntry.js";

  return {
    name: "keybridgeHost",
    mode: production ? "production" : "development",
    entry: path.join(projectPaths.source, "host/index.ts"),
    devtool: production ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: projectPaths.distribution,
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
      publicPath: "auto",
      uniqueName: "keybridgeHost",
      clean: {
        keep: /^remote\//,
      },
    },
    resolve: {
      extensions: resolveExtensions,
    },
    module: {
      rules: moduleRules,
    },
    performance: {
      assetFilter: (assetFilename) =>
        !assetFilename.endsWith(".png") && !assetFilename.endsWith(".map"),
    },
    watchOptions: {
      ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
      poll: 1000,
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "keybridgeHost",
        remotes: {
          keybridgeRemote: remoteLocation,
        },
        shared: sharedDependencies,
      }),
      new HtmlWebpackPlugin({
        template: path.join(projectPaths.source, "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(projectPaths.root, "public"),
            to: projectPaths.distribution,
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      static: {
        directory: projectPaths.distribution,
        watch: false,
      },
      watchFiles: {
        paths: [path.join(projectPaths.source, "**/*")],
        options: {
          usePolling: true,
          interval: 1000,
        },
      },
      client: {
        overlay: true,
      },
    },
  };
};

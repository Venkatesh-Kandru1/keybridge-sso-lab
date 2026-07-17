import path from "node:path";
import webpack from "webpack";
import {
  moduleRules,
  projectPaths,
  resolveExtensions,
  sharedDependencies,
} from "./webpack.shared.mjs";

const { ModuleFederationPlugin } = webpack.container;

export default (_environment, argumentsObject) => {
  const production = argumentsObject.mode === "production";

  return {
    name: "keybridgeRemote",
    mode: production ? "production" : "development",
    entry: path.join(projectPaths.source, "remote/bootstrap.ts"),
    devtool: production ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.join(projectPaths.distribution, "remote"),
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
      publicPath: production ? "/remote/" : "http://localhost:3001/",
      uniqueName: "keybridgeRemote",
      clean: true,
    },
    resolve: {
      extensions: resolveExtensions,
    },
    module: {
      rules: moduleRules,
    },
    watchOptions: {
      ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
      poll: 1000,
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "keybridgeRemote",
        filename: "remoteEntry.js",
        exposes: {
          "./KeyBridgeExperience": "./src/remote/KeyBridgeExperience.tsx",
        },
        shared: sharedDependencies,
      }),
    ],
    devServer: {
      port: 3001,
      hot: true,
      static: {
        directory: path.join(projectPaths.root, "public"),
        watch: false,
      },
      watchFiles: {
        paths: [path.join(projectPaths.source, "**/*")],
        options: {
          usePolling: true,
          interval: 1000,
        },
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      client: {
        overlay: true,
      },
    },
  };
};

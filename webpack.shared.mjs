import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export const projectPaths = {
  root: currentDirectory,
  source: path.join(currentDirectory, "src"),
  distribution: path.join(currentDirectory, "dist"),
};

export const moduleRules = [
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
  },
];

export const sharedDependencies = {
  react: {
    singleton: true,
    requiredVersion: "^19.2.6",
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^19.2.6",
  },
};

export const resolveExtensions = [".tsx", ".ts", ".jsx", ".js"];

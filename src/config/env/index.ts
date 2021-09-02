import path, { resolve } from "path";
let rootDir;
if (require.main) {
  const indexDir = resolve(path.dirname(require.main.filename));
  rootDir = indexDir.slice(0, -4); // remove the trailing /src
} else {
  throw new Error("Unable to resolve root directory path");
}

export const config = require("dotenv").config({
  path: `${rootDir}/.env`,
});

export const isProduction = process.env.NODE_ENV === "production";

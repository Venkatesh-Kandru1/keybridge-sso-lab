import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const credentialKeys = [
  "KEYBRIDGE_MEMBER_EMAIL",
  "KEYBRIDGE_MEMBER_PASSWORD",
  "KEYBRIDGE_ADMIN_EMAIL",
  "KEYBRIDGE_ADMIN_PASSWORD",
];

function parseEnvironmentFile(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
        return [key, value];
      }),
  );
}

export function loadDemoCredentials(projectRoot) {
  const localFile = path.join(projectRoot, ".env.local");
  const localValues = existsSync(localFile)
    ? parseEnvironmentFile(readFileSync(localFile, "utf8"))
    : {};

  return Object.fromEntries(
    credentialKeys.map((key) => [key, process.env[key] ?? localValues[key] ?? ""]),
  );
}

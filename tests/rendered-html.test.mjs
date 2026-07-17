import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function listFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const childUrl = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directoryUrl);
    if (entry.isDirectory()) {
      files.push(...await listFiles(childUrl));
    } else {
      files.push(childUrl);
    }
  }

  return files;
}

test("builds a Webpack host and federated remote", async () => {
  const distribution = new URL("dist/", projectRoot);
  const html = await readFile(new URL("index.html", distribution), "utf8");
  const remoteEntry = await readFile(new URL("remote/remoteEntry.js", distribution), "utf8");
  const files = await listFiles(distribution);
  const hostScripts = files.filter((file) => file.pathname.endsWith(".js") && !file.pathname.includes("/remote/"));
  const hostSource = (await Promise.all(hostScripts.map((file) => readFile(file, "utf8")))).join("\n");

  assert.match(html, /<title>KeyBridge \| Webpack Module Federation SSO<\/title>/i);
  assert.match(html, /id="root"/);
  assert.match(html, /og\.png/);
  assert.match(remoteEntry, /KeyBridgeExperience/);
  assert.match(hostSource, /keybridgeRemote/);
  assert.match(hostSource, /remoteEntry\.js/);
  await access(new URL("og.png", distribution));
});

test("declares isolated names and shared React singletons", async () => {
  const [hostConfig, remoteConfig, sharedConfig] = await Promise.all([
    readFile(new URL("webpack.host.config.mjs", projectRoot), "utf8"),
    readFile(new URL("webpack.remote.config.mjs", projectRoot), "utf8"),
    readFile(new URL("webpack.shared.mjs", projectRoot), "utf8"),
  ]);

  assert.match(hostConfig, /ModuleFederationPlugin/);
  assert.match(hostConfig, /uniqueName: "keybridgeHost"/);
  assert.match(hostConfig, /keybridgeRemote@\/remote\/remoteEntry\.js/);
  assert.match(remoteConfig, /filename: "remoteEntry\.js"/);
  assert.match(remoteConfig, /"\.\/KeyBridgeExperience"/);
  assert.match(remoteConfig, /uniqueName: "keybridgeRemote"/);
  assert.match(sharedConfig, /react:/);
  assert.match(sharedConfig, /"react-dom"/);
  assert.match(sharedConfig, /singleton: true/g);
});

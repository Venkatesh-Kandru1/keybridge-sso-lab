import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + String(Date.now()));
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the KeyBridge SSO experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KeyBridge \| Single Sign-On Application Demo<\/title>/i);
  assert.match(html, /One identity\./);
  assert.match(html, /Every app\./);
  assert.match(html, /Start a demo session/);
  assert.match(html, /No real credentials/);
  assert.match(html, /Authorization Code \+ PKCE/);
  assert.match(html, /Role-based access/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("includes accessible navigation and a live status region", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Skip to main content/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="Project navigation"/);
  assert.match(html, /Educational simulation only/);
});

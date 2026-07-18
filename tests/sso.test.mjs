import assert from "node:assert/strict";
import test from "node:test";
import {
  addAuditEvent,
  authenticateDemoCredentials,
  canAccessApplication,
  createAuthorizationRequest,
  createDemoClaims,
  getVisibleApplicationIds,
} from "../lib/sso.mjs";

test("authenticates only the documented fictional demo accounts", () => {
  const accounts = [
    {
      password: "local-test-password",
      persona: {
        name: "Local Test Member",
        email: "member@example.test",
        initials: "LT",
        roles: ["Member"],
      },
    },
  ];
  const member = authenticateDemoCredentials(accounts, "  MEMBER@EXAMPLE.TEST ", "local-test-password");
  assert.equal(member?.name, "Local Test Member");
  assert.deepEqual(member?.roles, ["Member"]);
  assert.equal(authenticateDemoCredentials(accounts, "member@example.test", "incorrect"), null);
  assert.equal(authenticateDemoCredentials(accounts, "unknown@example.test", "local-test-password"), null);
});

test("enforces application roles", () => {
  assert.equal(canAccessApplication("mail", ["Member"]), true);
  assert.equal(canAccessApplication("analytics", ["Member"]), false);
  assert.equal(canAccessApplication("admin", ["Member", "Analyst"]), false);
  assert.equal(canAccessApplication("admin", ["Administrator"]), true);
});

test("shows different application sets to members and administrators", () => {
  assert.deepEqual(getVisibleApplicationIds(["Member", "Analyst"]), [
    "mail",
    "files",
    "calendar",
    "analytics",
  ]);
  assert.deepEqual(getVisibleApplicationIds(["Member", "Analyst", "Administrator"]), [
    "mail",
    "files",
    "calendar",
    "analytics",
    "admin",
  ]);
});

test("creates a safe authorization-code request with PKCE", () => {
  const request = createAuthorizationRequest("files", "state-123", "nonce-456");
  assert.equal(request.client_id, "keybridge-files");
  assert.equal(request.redirect_uri, "https://files.keybridge.demo/callback");
  assert.equal(request.response_type, "code");
  assert.equal(request.code_challenge_method, "S256");
  assert.equal(request.state, "state-123");
  assert.equal(request.nonce, "nonce-456");
});

test("rejects unknown clients and incomplete requests", () => {
  assert.throws(() => createAuthorizationRequest("unknown", "state", "nonce"), /Unknown client/);
  assert.throws(() => createAuthorizationRequest("mail", "", "nonce"), /required/);
});

test("issues short-lived illustrative claims", () => {
  const claims = createDemoClaims({
    subject: "usr_vk_2026",
    audience: "keybridge-mail",
    email: "member@example.test",
    roles: ["Member"],
  });
  assert.equal(claims.iss, "https://id.keybridge.demo");
  assert.equal(claims.email, "member@example.test");
  assert.equal(claims.exp - claims.iat, 900);
  assert.deepEqual(claims.roles, ["Member"]);
});

test("keeps the newest audit events within the limit", () => {
  const events = addAuditEvent([{ id: 1 }, { id: 2 }], { id: 3 }, 2);
  assert.deepEqual(events, [{ id: 3 }, { id: 1 }]);
});

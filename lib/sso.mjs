export const registeredApplications = {
  mail: {
    clientId: "keybridge-mail",
    redirectUri: "https://mail.keybridge.demo/callback",
    requiredRole: "Member",
  },
  files: {
    clientId: "keybridge-files",
    redirectUri: "https://files.keybridge.demo/callback",
    requiredRole: "Member",
  },
  calendar: {
    clientId: "keybridge-calendar",
    redirectUri: "https://calendar.keybridge.demo/callback",
    requiredRole: "Member",
  },
  analytics: {
    clientId: "keybridge-analytics",
    redirectUri: "https://analytics.keybridge.demo/callback",
    requiredRole: "Analyst",
  },
  admin: {
    clientId: "keybridge-admin",
    redirectUri: "https://admin.keybridge.demo/callback",
    requiredRole: "Administrator",
  },
};

export function authenticateDemoCredentials(accounts, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = accounts.find(
    (candidate) =>
      candidate.persona.email.toLowerCase() === normalizedEmail &&
      candidate.password === password,
  );

  if (!account) return null;

  return {
    ...account.persona,
    roles: [...account.persona.roles],
  };
}

export function canAccessApplication(appId, roles = []) {
  const application = registeredApplications[appId];
  return Boolean(application && roles.includes(application.requiredRole));
}

export function createAuthorizationRequest(appId, state, nonce) {
  const application = registeredApplications[appId];
  if (!application) throw new Error("Unknown client application");
  if (!state || !nonce) throw new Error("State and nonce are required");

  return {
    client_id: application.clientId,
    redirect_uri: application.redirectUri,
    response_type: "code",
    scope: "openid profile email roles",
    code_challenge_method: "S256",
    state,
    nonce,
  };
}

export function createDemoClaims(persona, now = 1_700_000_000) {
  return {
    iss: "https://id.keybridge.demo",
    sub: persona.subject,
    aud: persona.audience,
    email: persona.email,
    roles: [...persona.roles],
    iat: now,
    exp: now + 900,
  };
}

export function addAuditEvent(events, event, maximum = 20) {
  return [event, ...events].slice(0, maximum);
}

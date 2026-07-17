# KeyBridge SSO Lab

KeyBridge is an original, interactive single sign-on demonstration built with React, TypeScript, and Next.js. One fictional identity session unlocks a suite of connected applications without asking the user to sign in again.

> Educational simulation only. KeyBridge does not collect credentials, issue real tokens, or replace a production identity provider.

## Portfolio highlights

- One-click fictional identity session shared across five connected applications
- Application launcher for Mail, Files, Calendar, Analytics, and an Admin Console
- Role-based access control with visible access-denied behavior
- Illustrative OpenID Connect claims and an Authorization Code + PKCE trace
- Global sign-out and authentication audit events
- Responsive, keyboard-friendly interface with reduced-motion support
- Automated server-rendering and identity-domain tests

## How the demonstration works

1. A person chooses a fictional KeyBridge profile.
2. KeyBridge creates a browser-local demo session; no password is requested.
3. Each application checks the roles associated with that identity.
4. Permitted applications open without another sign-in.
5. Global sign-out clears the shared demo session for every application.

The pure functions in lib/sso.mjs model registered clients, exact redirect URIs, PKCE authorization requests, short-lived claims, role checks, and bounded audit logs. The visual application intentionally keeps these flows simulated so the public demo cannot be mistaken for a production security system.

## Security concepts represented

- OpenID Connect identity claims
- OAuth Authorization Code flow with PKCE S256
- Exact redirect URI matching
- State and nonce parameters
- Short-lived ID token claims
- Role-based least privilege
- Global session termination
- Authentication observability

## Open-source and standards references

The implementation is original. These sources informed the terminology and product architecture:

- OpenID Connect Core 1.0: https://openid.net/specs/openid-connect-core-1_0-final.html
- OAuth 2.0 Security Best Current Practice, RFC 9700: https://www.rfc-editor.org/rfc/rfc9700
- Keycloak: https://github.com/keycloak/keycloak
- Logto: https://github.com/logto-io/logto
- ZITADEL: https://github.com/zitadel/zitadel

No source code was copied from these projects.

## Local development

Install dependencies, start the development server, and open the local URL shown in the terminal.

For quality checks, run the test, lint, and production build scripts defined in package.json.

## License

MIT © 2026 Venkatesh Kandru

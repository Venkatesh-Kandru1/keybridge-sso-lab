# KeyBridge SSO Lab

KeyBridge is an original single sign-on demonstration implemented as a Webpack 5 Module Federation application. A small host shell loads the full identity experience from an independently compiled remote container at runtime.

> Educational simulation only. KeyBridge does not collect credentials, issue real tokens, or replace a production identity provider.

## Module Federation architecture

    Browser
       |
       v
    KeyBridge Host :3000
       |
       | loads remoteEntry.js at runtime
       v
    KeyBridge Experience Remote :3001
       |
       +-- shared React singleton
       +-- SSO identity chooser
       +-- connected application launcher
       +-- role checks and audit events

The host and remote are separate Webpack compilations with different unique names. The remote exposes KeyBridgeExperience through remoteEntry.js, and the host consumes it asynchronously. React and React DOM are shared as singleton dependencies so both builds use the same runtime.

Production builds place the remote container under dist/remote and configure the host to load it from the same origin. Development runs the host and remote on separate ports to demonstrate the independently served micro-frontend boundary.

## Portfolio highlights

- Webpack 5 ModuleFederationPlugin with a host-and-remote topology
- Runtime remote loading with React Suspense and an error boundary
- Unique build names that prevent Webpack runtime collisions
- Shared singleton React and React DOM dependencies
- One fictional identity session across five connected applications
- Role-based access, global sign-out, illustrative claims, and audit events
- Responsive, keyboard-friendly interface with reduced-motion support
- Automated tests for federation artifacts, security-domain logic, and build configuration

## Commands

- npm install — install the locked dependencies
- npm run dev — start the remote on port 3001, then the host on port 3000
- npm run build — type-check and create both production compilations
- npm run lint — check the host, remote, and Webpack configuration
- npm test — build and run all automated tests

## Important files

- webpack.host.config.mjs — host container and runtime remote definition
- webpack.remote.config.mjs — remote container and exposed experience
- webpack.shared.mjs — loaders, paths, and shared dependency policy
- src/host — asynchronous host bootstrap and federation fallback UI
- src/remote — the exposed KeyBridge product experience
- src/types/remotes.d.ts — TypeScript contract for the runtime remote
- lib/sso.mjs — pure SSO domain functions used by automated tests

## Security concepts represented

- OpenID Connect identity claims
- OAuth Authorization Code flow with PKCE S256
- Exact redirect URI matching
- State and nonce parameters
- Short-lived ID token claims
- Role-based least privilege
- Global session termination
- Authentication observability

## References

The implementation is original. These sources informed the architecture and terminology:

- Webpack Module Federation: https://webpack.js.org/concepts/module-federation/
- Module Federation examples: https://github.com/module-federation/module-federation-examples
- OpenID Connect Core 1.0: https://openid.net/specs/openid-connect-core-1_0-final.html
- OAuth 2.0 Security Best Current Practice, RFC 9700: https://www.rfc-editor.org/rfc/rfc9700
- Keycloak: https://github.com/keycloak/keycloak
- Logto: https://github.com/logto-io/logto
- ZITADEL: https://github.com/zitadel/zitadel

No source code was copied from these projects.

## License

MIT © 2026 Venkatesh Kandru

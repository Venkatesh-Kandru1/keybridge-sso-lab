import { useMemo, useState, type FormEvent } from "react";
import { authenticateDemoCredentials } from "../../lib/sso.mjs";

type Persona = {
  name: string;
  email: string;
  initials: string;
  roles: string[];
};

type AuditEvent = {
  id: number;
  action: string;
  detail: string;
  status: "Success" | "Denied";
  time: string;
};

const demoAccounts = [
  {
    password: process.env.KEYBRIDGE_MEMBER_PASSWORD ?? "",
    persona: {
      name: "Venkatesh Kandru",
      email: process.env.KEYBRIDGE_MEMBER_EMAIL ?? "",
      initials: "VK",
      roles: ["Member", "Analyst"],
    },
  },
  {
    password: process.env.KEYBRIDGE_ADMIN_PASSWORD ?? "",
    persona: {
      name: "Demo Administrator",
      email: process.env.KEYBRIDGE_ADMIN_EMAIL ?? "",
      initials: "DA",
      roles: ["Member", "Analyst", "Administrator"],
    },
  },
].filter((account) => account.persona.email && account.password);

const applications = [
  {
    id: "mail",
    name: "Pulse Mail",
    monogram: "M",
    eyebrow: "Communication",
    description: "A focused team inbox with shared conversations.",
    signal: "8 unread",
    requiredRole: "Member",
  },
  {
    id: "files",
    name: "Atlas Files",
    monogram: "F",
    eyebrow: "Documents",
    description: "Secure project files and collaborative documents.",
    signal: "24 files",
    requiredRole: "Member",
  },
  {
    id: "calendar",
    name: "Moment Calendar",
    monogram: "C",
    eyebrow: "Scheduling",
    description: "Team events, interviews, and delivery milestones.",
    signal: "3 today",
    requiredRole: "Member",
  },
  {
    id: "analytics",
    name: "Signal Analytics",
    monogram: "A",
    eyebrow: "Insights",
    description: "Product health and authentication trends.",
    signal: "99.98% uptime",
    requiredRole: "Analyst",
  },
  {
    id: "admin",
    name: "Access Console",
    monogram: "K",
    eyebrow: "Administration",
    description: "Manage people, roles, and connected applications.",
    signal: "Admin only",
    requiredRole: "Administrator",
  },
] as const;

type AppId = (typeof applications)[number]["id"];

function currentTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function ProductMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function StatusDot() {
  return <span className="status-dot" aria-hidden="true" />;
}

function AppPreview({ appId }: { appId: AppId }) {
  if (appId === "mail") {
    return (
      <div className="mail-preview">
        <div className="preview-toolbar">
          <strong>Priority inbox</strong>
          <span>8 unread</span>
        </div>
        {[
          ["SK", "Sarah Kim", "Design system review", "The new tokens are ready for feedback.", "2m"],
          ["JD", "Jordan Diaz", "Release checklist", "All quality gates passed for the client portal.", "18m"],
          ["AM", "Amina Malik", "Customer onboarding", "I shared the updated implementation notes.", "1h"],
        ].map((message) => (
          <article className="message-row" key={message[2]}>
            <span className="mini-avatar">{message[0]}</span>
            <span>
              <strong>{message[1]}</strong>
              <b>{message[2]}</b>
              <small>{message[3]}</small>
            </span>
            <time>{message[4]}</time>
          </article>
        ))}
      </div>
    );
  }

  if (appId === "files") {
    return (
      <div className="file-preview">
        {[
          ["PDF", "Identity architecture", "Updated 12 minutes ago", "2.8 MB"],
          ["DOC", "Frontend handoff", "Updated yesterday", "820 KB"],
          ["XLS", "Launch readiness", "Updated Tuesday", "1.4 MB"],
          ["FIG", "Application shell", "Updated Monday", "6.2 MB"],
        ].map((file) => (
          <article className="file-row" key={file[1]}>
            <span className="file-type">{file[0]}</span>
            <span>
              <strong>{file[1]}</strong>
              <small>{file[2]}</small>
            </span>
            <b>{file[3]}</b>
          </article>
        ))}
      </div>
    );
  }

  if (appId === "calendar") {
    return (
      <div className="calendar-preview">
        <div className="date-card">
          <span>JUL</span>
          <strong>17</strong>
          <small>Friday</small>
        </div>
        <div className="agenda-list">
          {[
            ["09:30", "Architecture sync", "Engineering"],
            ["11:00", "Accessibility review", "Design systems"],
            ["14:30", "Release readiness", "Platform"],
          ].map((event) => (
            <article key={event[1]}>
              <time>{event[0]}</time>
              <span>
                <strong>{event[1]}</strong>
                <small>{event[2]}</small>
              </span>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (appId === "analytics") {
    return (
      <div className="analytics-preview">
        <div className="metric-row">
          <article><span>SSO success</span><strong>99.98%</strong><small>+0.14% this week</small></article>
          <article><span>Active sessions</span><strong>2,481</strong><small>Across 14 apps</small></article>
          <article><span>Median sign-in</span><strong>1.2s</strong><small>Within target</small></article>
        </div>
        <div className="chart-card" aria-label="Seven-day authentication success chart">
          {[54, 67, 61, 78, 72, 88, 94].map((height, index) => (
            <span key={height + index} style={{ height: String(height) + "%" }}><i>{["M", "T", "W", "T", "F", "S", "S"][index]}</i></span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-preview">
      <div className="admin-summary">
        <span>Workspace access</span>
        <strong>128 people</strong>
        <small>4 role groups · 5 connected apps</small>
      </div>
      {[
        ["VK", "Venkatesh Kandru", "Member · Analyst", "Active"],
        ["DA", "Demo Administrator", "Administrator", "Active"],
        ["PM", "Priya Mehta", "Member", "Invited"],
      ].map((member) => (
        <article className="member-row" key={member[1]}>
          <span className="mini-avatar">{member[0]}</span>
          <span><strong>{member[1]}</strong><small>{member[2]}</small></span>
          <b>{member[3]}</b>
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  const [session, setSession] = useState<Persona | null>(null);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState("Demo ready");
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signInError, setSignInError] = useState("");

  const activeApplication = useMemo(
    () => applications.find((application) => application.id === activeApp) ?? null,
    [activeApp],
  );

  function addAudit(action: string, detail: string, status: AuditEvent["status"]) {
    setAudit((events) => [
      {
        id: Date.now(),
        action,
        detail,
        status,
        time: currentTime(),
      },
      ...events,
    ].slice(0, 6));
  }

  function signIn(persona: Persona) {
    setSession(persona);
    window.localStorage.setItem("keybridge-demo-session", JSON.stringify(persona));
    addAudit("Identity verified", persona.email + " authenticated at KeyBridge", "Success");
    setLiveMessage("Signed in once. All permitted applications are now available.");
  }

  function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const persona = authenticateDemoCredentials(demoAccounts, email, password) as Persona | null;

    if (!persona) {
      setSignInError("The email or password does not match the locally configured demo credentials.");
      setLiveMessage("Sign-in failed. Check the demo email and password.");
      return;
    }

    setSignInError("");
    setPassword("");
    signIn(persona);
  }

  function launchApp(appId: AppId) {
    if (!session) return;
    const application = applications.find((item) => item.id === appId);
    if (!application) return;
    if (!session.roles.includes(application.requiredRole)) {
      addAudit("Access blocked", application.name + " requires " + application.requiredRole, "Denied");
      setLiveMessage("Access denied. Your role does not include " + application.name + ".");
      return;
    }
    setActiveApp(appId);
    addAudit("SSO launch", application.name + " accepted the shared identity session", "Success");
    setLiveMessage(application.name + " opened without another sign-in.");
  }

  function signOut() {
    window.localStorage.removeItem("keybridge-demo-session");
    setSession(null);
    setActiveApp(null);
    setAudit([]);
    setEmail("");
    setPassword("");
    setSignInError("");
    setLiveMessage("Global sign-out completed across every connected app.");
  }

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <p className="sr-only" aria-live="polite">{liveMessage}</p>

      <header className="site-header">
        <a className="brand" href="#" aria-label="KeyBridge home">
          <ProductMark />
          <span>KeyBridge</span>
          <small>SSO Lab</small>
        </a>
        {session && (
          <nav aria-label="Project navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
            <a href="https://github.com/Venkatesh-Kandru1/keybridge-sso-lab">GitHub</a>
          </nav>
        )}
        {session ? (
          <button className="ghost-button" type="button" onClick={signOut}>Sign out everywhere</button>
        ) : (
          <span className="demo-badge"><StatusDot /> Safe demo</span>
        )}
      </header>

      {!session ? (
        <section className="login-page" id="main-content">
          <div className="login-intro">
            <span className="eyebrow">KeyBridge Identity</span>
            <h1>One secure sign-in.<br /><em>Every connected app.</em></h1>
            <p>
              Sign in once to enter your KeyBridge workspace, then open every application
              your role allows without entering your credentials again.
            </p>
            <div className="login-benefits" aria-label="KeyBridge demo benefits">
              <span><b>01</b> Central identity</span>
              <span><b>02</b> Role-based access</span>
              <span><b>03</b> Global sign-out</span>
            </div>
          </div>

          <div className="login-card" aria-labelledby="signin-title">
            <div className="signin-heading">
              <ProductMark />
              <span>
                <small>Welcome to KeyBridge</small>
                <strong id="signin-title">Sign in to your workspace</strong>
              </span>
            </div>
            <p className="login-description">Use the fictional credentials saved in your local environment file. Never enter a real email address or password.</p>

            <form className="login-form" onSubmit={handleSignIn} noValidate>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@keybridge.dev"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSignInError("");
                }}
                required
              />

              <div className="password-label">
                <label htmlFor="password">Password</label>
                <span>Demo credentials only</span>
              </div>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter demo password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setSignInError("");
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>

              {signInError && <p className="login-error" role="alert">{signInError}</p>}

              <button className="primary-signin" type="submit">
                Sign in securely <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="signin-note">
              <span aria-hidden="true">i</span>
              Educational simulation only. Local credentials do not protect real data and are never committed to the repository.
            </div>
          </div>
        </section>
      ) : (
        <section className="workspace" id="main-content">
          <aside className="workspace-sidebar">
            <div className="sidebar-profile">
              <span className="profile-avatar profile-0">{session.initials}</span>
              <span>
                <strong>{session.name}</strong>
                <small>{session.email}</small>
              </span>
            </div>
            <div className="session-health">
              <span><StatusDot /> SSO session active</span>
              <strong>One sign-in</strong>
              <small>Valid across 5 connected apps</small>
            </div>
            <nav aria-label="Workspace sections">
              <button type="button" className={!activeApp ? "active" : ""} onClick={() => setActiveApp(null)}>
                <span aria-hidden="true">⌂</span> App launcher
              </button>
              <button type="button" onClick={() => setProtocolOpen((open) => !open)}>
                <span aria-hidden="true">↔</span> Protocol trace
              </button>
              <a href="#audit"><span aria-hidden="true">◷</span> Audit events</a>
            </nav>
            <button className="sidebar-signout" type="button" onClick={signOut}>Sign out everywhere</button>
          </aside>

          <div className="workspace-main">
            {!activeApplication ? (
              <>
                <div className="workspace-heading">
                  <span>
                    <small>Welcome back</small>
                    <h2>Your connected workspace</h2>
                    <p>Select any permitted app. KeyBridge reuses your existing identity session.</p>
                  </span>
                  <div className="role-pills" aria-label="Current roles">
                    {session.roles.map((role) => <span key={role}>{role}</span>)}
                  </div>
                </div>

                <div className="app-grid">
                  {applications.map((application) => {
                    const allowed = session.roles.includes(application.requiredRole);
                    return (
                      <article className={"app-card app-" + application.id} key={application.id}>
                        <div className="app-card-top">
                          <span className="app-icon">{application.monogram}</span>
                          <span className={allowed ? "access-chip allowed" : "access-chip blocked"}>
                            {allowed ? "SSO ready" : application.requiredRole + " role"}
                          </span>
                        </div>
                        <small>{application.eyebrow}</small>
                        <h3>{application.name}</h3>
                        <p>{application.description}</p>
                        <div className="app-card-footer">
                          <span>{application.signal}</span>
                          <button type="button" onClick={() => launchApp(application.id)}>
                            {allowed ? "Open app" : "Request access"} <b aria-hidden="true">↗</b>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {protocolOpen && (
                  <section className="protocol-trace" aria-labelledby="trace-title">
                    <div className="section-heading">
                      <span><small>Protocol trace</small><h3 id="trace-title">What happened behind the interface</h3></span>
                      <button type="button" onClick={() => setProtocolOpen(false)} aria-label="Close protocol trace">×</button>
                    </div>
                    <ol>
                      <li><span>01</span><div><strong>Authorization request</strong><code>response_type=code · scope=openid profile email</code></div><b>Complete</b></li>
                      <li><span>02</span><div><strong>PKCE challenge</strong><code>code_challenge_method=S256</code></div><b>Verified</b></li>
                      <li><span>03</span><div><strong>Identity session</strong><code>issuer=https://id.keybridge.demo</code></div><b>Active</b></li>
                      <li><span>04</span><div><strong>Role claims</strong><code>roles={session.roles.join(", ")}</code></div><b>Applied</b></li>
                    </ol>
                  </section>
                )}

                <section className="audit-panel" id="audit" aria-labelledby="audit-title">
                  <div className="section-heading">
                    <span><small>Security observability</small><h3 id="audit-title">Authentication audit</h3></span>
                    <span className="event-count">{audit.length} events</span>
                  </div>
                  {audit.length ? (
                    <div className="audit-list">
                      {audit.map((event) => (
                        <article key={event.id}>
                          <span className={event.status === "Success" ? "event-icon success" : "event-icon denied"}>
                            {event.status === "Success" ? "✓" : "!"}
                          </span>
                          <span><strong>{event.action}</strong><small>{event.detail}</small></span>
                          <b className={event.status.toLowerCase()}>{event.status}</b>
                          <time>{event.time}</time>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">Open an application to generate an SSO audit event.</p>
                  )}
                </section>
              </>
            ) : (
              <section className="connected-app" aria-labelledby="connected-app-title">
                <div className="connected-header">
                  <button type="button" onClick={() => setActiveApp(null)}>← App launcher</button>
                  <div className="connected-brand">
                    <span className={"app-icon app-" + activeApplication.id}>{activeApplication.monogram}</span>
                    <span><small>{activeApplication.eyebrow}</small><h2 id="connected-app-title">{activeApplication.name}</h2></span>
                  </div>
                  <span className="connected-user"><StatusDot /> {session.email}</span>
                </div>
                <div className="connected-content">
                  <div className="app-product">
                    <div className="sso-success-banner">
                      <span>✓</span>
                      <p><strong>Signed in with KeyBridge</strong>Your existing session was accepted. No second login was required.</p>
                    </div>
                    <AppPreview appId={activeApplication.id} />
                  </div>
                  <aside className="claims-card">
                    <small>Verified ID token</small>
                    <h3>Identity claims</h3>
                    <dl>
                      <div><dt>sub</dt><dd>usr_vk_2026</dd></div>
                      <div><dt>email</dt><dd>{session.email}</dd></div>
                      <div><dt>aud</dt><dd>keybridge-{activeApplication.id}</dd></div>
                      <div><dt>roles</dt><dd>{session.roles.join(", ")}</dd></div>
                      <div><dt>expires</dt><dd>in 14 minutes</dd></div>
                    </dl>
                    <span className="token-note">Illustrative claims — no real token is created.</span>
                  </aside>
                </div>
              </section>
            )}
          </div>
        </section>
      )}

      {session && <><section className="explainer" id="how-it-works">
        <div className="explainer-heading">
          <span className="eyebrow">Authorization Code + PKCE</span>
          <h2>One authentication,<br />five trusted applications.</h2>
          <p>KeyBridge models the essential responsibilities of an OpenID Provider while keeping every interaction fictional and safe.</p>
        </div>
        <ol className="flow-steps">
          <li><span>01</span><div><strong>Choose an application</strong><p>The client redirects to the central identity provider with a registered return address.</p></div></li>
          <li><span>02</span><div><strong>Authenticate once</strong><p>KeyBridge establishes a shared session and returns an authorization code.</p></div></li>
          <li><span>03</span><div><strong>Validate claims</strong><p>The application checks issuer, audience, expiry, nonce, and assigned roles.</p></div></li>
          <li><span>04</span><div><strong>Reuse the session</strong><p>Other trusted applications can complete SSO without requesting credentials again.</p></div></li>
        </ol>
      </section>

      <section className="security-section" id="security">
        <div>
          <span className="eyebrow">Security-first architecture</span>
          <h2>Designed to explain the controls, not hide them.</h2>
        </div>
        <div className="security-grid">
          {[
            ["S256", "PKCE by default", "Binds the authorization request to the client that started it."],
            ["URI", "Exact redirect matching", "Only pre-registered destinations can receive an authorization response."],
            ["N+C", "State and nonce", "Protects browser flows against request forgery and replay."],
            ["RBAC", "Role-based access", "Applications enforce the least privilege needed for each capability."],
            ["15m", "Short-lived tokens", "Limits exposure while the central session supports a smooth experience."],
            ["LOG", "Global audit trail", "Records successful launches, blocked access, and session activity."],
          ].map((control) => (
            <article key={control[1]}><span>{control[0]}</span><strong>{control[1]}</strong><p>{control[2]}</p></article>
          ))}
        </div>
      </section>

      <footer>
        <a className="brand" href="#"><ProductMark /><span>KeyBridge</span></a>
        <p>Original educational SSO demonstration by Venkatesh Kandru.</p>
        <a href="https://github.com/Venkatesh-Kandru1/keybridge-sso-lab">View source on GitHub ↗</a>
      </footer>
      </>}
    </main>
  );
}

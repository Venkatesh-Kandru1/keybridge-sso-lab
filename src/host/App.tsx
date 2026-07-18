import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";

const FederatedKeyBridgeExperience = lazy(
  () => import("keybridgeRemote/KeyBridgeExperience"),
);

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function LoadingExperience() {
  return (
    <main className="federation-loading" role="status" aria-live="polite">
      <BrandMark />
      <strong>Connecting the KeyBridge remote</strong>
      <p>The Webpack host is loading the federated SSO experience.</p>
    </main>
  );
}

type BoundaryProps = {
  children: ReactNode;
};

type BoundaryState = {
  failed: boolean;
};

class FederationErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to load the KeyBridge federated remote", error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="federation-error" role="alert">
          <BrandMark />
          <strong>The federated experience is unavailable</strong>
          <p>Start the KeyBridge remote on port 3001, then reload the host.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload application
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <FederationErrorBoundary>
      <Suspense fallback={<LoadingExperience />}>
        <FederatedKeyBridgeExperience />
      </Suspense>
    </FederationErrorBoundary>
  );
}

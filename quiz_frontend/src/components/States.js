import React from "react";

// PUBLIC_INTERFACE
export function InlineLoading({ label = "Loading…" }) {
  /** Small inline loading placeholder. */
  return (
    <div className="card" aria-busy="true">
      <div className="skeleton" style={{ width: "40%", marginBottom: 10 }} />
      <div className="skeleton" style={{ width: "90%", marginBottom: 8 }} />
      <div className="skeleton" style={{ width: "70%" }} />
      <div className="small" style={{ marginTop: 10 }}>
        {label}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FullPageLoading({ label = "Loading…" }) {
  /** Full page loading state. */
  return (
    <div className="container center" aria-busy="true">
      <div className="card" style={{ maxWidth: 520, width: "100%" }}>
        <div className="skeleton" style={{ width: "35%", marginBottom: 12 }} />
        <div className="skeleton" style={{ width: "92%", marginBottom: 8 }} />
        <div className="skeleton" style={{ width: "65%" }} />
        <div className="small" style={{ marginTop: 12 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  /** Error box with optional retry button. */
  return (
    <div className="notice error" role="alert">
      <div style={{ fontWeight: 800 }}>{title}</div>
      {message ? <div className="small" style={{ marginTop: 4, color: "#7f1d1d" }}>{message}</div> : null}
      {onRetry ? (
        <div style={{ marginTop: 10 }}>
          <button className="btn" onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export function EmptyState({ title = "Nothing here yet", message, action }) {
  /** Empty list state with optional action button. */
  return (
    <div className="card">
      <h3 className="card-title" style={{ marginTop: 0 }}>
        {title}
      </h3>
      {message ? <p className="card-muted">{message}</p> : null}
      {action ? <div style={{ marginTop: 10 }}>{action}</div> : null}
    </div>
  );
}

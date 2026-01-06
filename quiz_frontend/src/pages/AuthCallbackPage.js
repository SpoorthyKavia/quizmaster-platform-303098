import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function AuthCallbackPage() {
  /** Landing page for Supabase emailRedirectTo links. */
  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Authentication complete</h1>
          <p className="subtitle">You can now return to the app.</p>
        </div>
      </div>
      <div className="card">
        <p className="card-muted">
          If you were redirected here after confirming your email, please continue to the login page.
        </p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link to="/login" className="btn btn-primary">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}

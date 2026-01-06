import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ErrorState } from "../components/States";

// PUBLIC_INTERFACE
export function SignupPage() {
  /** Signup screen for email/password auth (Supabase or backend placeholder). */
  const { signup } = useAuth();
  const nav = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const res = await signup(email.trim(), password, displayName.trim());
      // With Supabase email confirmations, session may be null; show a friendly message.
      if (!res?.access_token) {
        setDone(true);
      } else {
        nav("/dashboard", { replace: true });
      }
    } catch (ex) {
      setErr(ex?.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Create your account</h1>
          <p className="subtitle">Join QuizMaster and start competing on the leaderboard.</p>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3 className="card-title">Sign up</h3>
          {err ? <div style={{ marginBottom: 12 }}><ErrorState title="Unable to sign up" message={err} /></div> : null}
          {done ? (
            <div className="notice success" role="status" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>Check your email</div>
              <div className="small">If email confirmation is enabled, click the link to finish creating your account.</div>
            </div>
          ) : null}

          <form className="form-grid" onSubmit={onSubmit}>
            <div>
              <label className="small">Display name</label>
              <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Alex" />
            </div>

            <div>
              <label className="small">Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
            </div>

            <div>
              <label className="small">Password</label>
              <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required />
              <div className="small" style={{ marginTop: 6 }}>
                Use at least 8 characters.
              </div>
            </div>

            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? "Creating…" : "Create account"}
              </button>
              <Link className="btn btn-link" to="/login">
                Back to login
              </Link>
            </div>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">Tips</h3>
          <p className="card-muted">
            Admin features (question CRUD) are gated by role on the backend. Until the backend is implemented, the admin UI will render but may show
            request errors. This frontend already includes robust error/empty states.
          </p>
          <hr className="hr" />
          <p className="card-muted">
            You can configure the backend URL with <code>REACT_APP_API_BASE_URL</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

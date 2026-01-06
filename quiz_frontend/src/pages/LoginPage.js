import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ErrorState } from "../components/States";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login screen for email/password auth (Supabase or backend placeholder). */
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from || "/dashboard", [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      nav(from, { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Welcome back</h1>
          <p className="subtitle">Sign in to take quizzes, track scores, and view the leaderboard.</p>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3 className="card-title">Sign in</h3>
          {err ? <div style={{ marginBottom: 12 }}><ErrorState title="Unable to sign in" message={err} /></div> : null}

          <form className="form-grid" onSubmit={onSubmit}>
            <div>
              <label className="small">Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
            </div>

            <div>
              <label className="small">Password</label>
              <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
            </div>

            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </button>
              <Link className="btn btn-link" to="/signup">
                Create account
              </Link>
            </div>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">What you can do</h3>
          <div className="list">
            <div className="list-item">
              <div>
                <div className="list-title">Take quizzes</div>
                <div className="list-subtitle">Answer multiple-choice questions and submit.</div>
              </div>
              <span className="badge">Interactive</span>
            </div>
            <div className="list-item">
              <div>
                <div className="list-title">Track progress</div>
                <div className="list-subtitle">See your recent attempts and score summaries.</div>
              </div>
              <span className="badge success">Scores</span>
            </div>
            <div className="list-item">
              <div>
                <div className="list-title">Leaderboard</div>
                <div className="list-subtitle">Compare scores across players.</div>
              </div>
              <span className="badge">Rankings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

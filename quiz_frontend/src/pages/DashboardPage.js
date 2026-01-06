import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { ErrorState, InlineLoading } from "../components/States";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export function DashboardPage() {
  /** User dashboard showing summary KPIs and quick navigation. */
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [summary, setSummary] = useState(null);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      // Anticipated backend endpoint; until then, errors are handled gracefully.
      const data = await api.profile.get();
      setSummary(data);
    } catch (ex) {
      setSummary(null);
      setErr(ex?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Dashboard</h1>
          <p className="subtitle">Welcome {user?.display_name || user?.email || "back"}.</p>
        </div>
        <div className="row">
          <Link className="btn btn-primary" to="/quizzes">
            Take a quiz
          </Link>
          <Link className="btn" to="/leaderboard">
            View leaderboard
          </Link>
        </div>
      </div>

      {loading ? <InlineLoading label="Loading your summary…" /> : null}
      {!loading && err ? <ErrorState title="Dashboard unavailable" message={err} onRetry={load} /> : null}

      {!loading && !err ? (
        <div className="grid cols-3" style={{ marginTop: 14 }}>
          <div className="card">
            <div className="kpi">
              <div className="kpi-value">{summary?.stats?.attempts ?? "—"}</div>
              <div className="kpi-label">Attempts</div>
            </div>
            <p className="card-muted">Total quiz submissions.</p>
          </div>
          <div className="card">
            <div className="kpi">
              <div className="kpi-value">{summary?.stats?.best_score ?? "—"}</div>
              <div className="kpi-label">Best score</div>
            </div>
            <p className="card-muted">Highest score achieved.</p>
          </div>
          <div className="card">
            <div className="kpi">
              <div className="kpi-value">{summary?.stats?.rank ?? "—"}</div>
              <div className="kpi-label">Rank</div>
            </div>
            <p className="card-muted">Leaderboard position (when available).</p>
          </div>

          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3 className="card-title">Quick actions</h3>
            <div className="row">
              <Link to="/quizzes" className="btn btn-primary">
                Browse quizzes
              </Link>
              <Link to="/profile" className="btn">
                Edit profile
              </Link>
              <Link to="/questions" className="btn">
                Manage questions (admin)
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

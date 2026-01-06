import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { EmptyState, ErrorState, InlineLoading } from "../components/States";

// PUBLIC_INTERFACE
export function LeaderboardPage() {
  /** Leaderboard page showing top scores. */
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api.leaderboard.get();
      setRows(Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []);
    } catch (ex) {
      setRows([]);
      setErr(ex?.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Leaderboard</h1>
          <p className="subtitle">Top performers across all quizzes.</p>
        </div>
        <button className="btn" onClick={load}>
          Refresh
        </button>
      </div>

      {err ? <div style={{ marginBottom: 12 }}><ErrorState title="Leaderboard unavailable" message={err} onRetry={load} /></div> : null}
      {loading ? <InlineLoading label="Loading leaderboard…" /> : null}

      {!loading && !err && rows.length === 0 ? (
        <EmptyState title="No scores yet" message="Once users submit quizzes, the leaderboard will populate here." action={<button className="btn btn-primary" onClick={load}>Retry</button>} />
      ) : null}

      {!loading && rows.length > 0 ? (
        <div className="card">
          <h3 className="card-title" style={{ marginTop: 0 }}>
            Rankings
          </h3>
          <div className="list">
            {rows.map((r, i) => (
              <div className="list-item" key={r.user_id || r.id || i}>
                <div>
                  <div className="list-title">
                    #{r.rank ?? i + 1} • {r.display_name || r.name || r.email || "Player"}
                  </div>
                  <div className="list-subtitle">{r.quiz_title ? `Quiz: ${r.quiz_title}` : "All quizzes"}</div>
                </div>
                <div className="row">
                  <span className="badge success">{r.score ?? r.points ?? "—"} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

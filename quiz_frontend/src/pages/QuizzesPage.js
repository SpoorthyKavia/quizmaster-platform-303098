import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { EmptyState, ErrorState, InlineLoading } from "../components/States";

// PUBLIC_INTERFACE
export function QuizzesPage() {
  /** Browse available quizzes and start a new session. */
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api.quizzes.list();
      setQuizzes(Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []);
    } catch (ex) {
      setQuizzes([]);
      setErr(ex?.message || "Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startQuiz = async (quizId) => {
    try {
      const data = await api.quizzes.start(quizId);
      const sessionId = data?.session_id || data?.id || data?.sessionId;
      nav(`/quizzes/${encodeURIComponent(quizId)}/take`, { state: { sessionId } });
    } catch (ex) {
      setErr(ex?.message || "Unable to start quiz.");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Quizzes</h1>
          <p className="subtitle">Choose a quiz to begin. Your score will be saved after submission.</p>
        </div>
        <button className="btn" onClick={load}>
          Refresh
        </button>
      </div>

      {err ? <div style={{ marginBottom: 12 }}><ErrorState title="Unable to load quizzes" message={err} /></div> : null}
      {loading ? <InlineLoading label="Loading quizzes…" /> : null}

      {!loading && !err && quizzes.length === 0 ? (
        <EmptyState title="No quizzes available" message="Once the backend is connected, quizzes will appear here." action={<button className="btn btn-primary" onClick={load}>Retry</button>} />
      ) : null}

      {!loading && quizzes.length > 0 ? (
        <div className="list">
          {quizzes.map((q) => (
            <div className="list-item" key={q.id || q.quiz_id || q.slug}>
              <div style={{ minWidth: 0 }}>
                <div className="list-title">{q.title || q.name || "Untitled quiz"}</div>
                <div className="list-subtitle">
                  {(q.description || "Multiple-choice quiz.")}{" "}
                  {q.question_count ? <span className="badge" style={{ marginLeft: 8 }}>{q.question_count} questions</span> : null}
                </div>
              </div>
              <div className="row">
                {q.difficulty ? <span className="badge">{String(q.difficulty)}</span> : null}
                <button className="btn btn-primary" onClick={() => startQuiz(q.id || q.quiz_id || q.slug)}>
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { ErrorState, InlineLoading } from "../components/States";

// PUBLIC_INTERFACE
export function QuizTakePage() {
  /** Quiz taking page: step through questions, select answers, submit for scoring. */
  const { quizId } = useParams();
  const location = useLocation();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sessionId, setSessionId] = useState(location.state?.sessionId || "");
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selectedIndex
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const questions = useMemo(() => (Array.isArray(quiz?.questions) ? quiz.questions : []), [quiz]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api.quizzes.start(quizId); // Backend can return session + questions; if not, errors are handled.
      const sid = data?.session_id || data?.id || data?.sessionId || sessionId;
      setSessionId(sid || "");
      setQuiz(data?.quiz || data); // support either shape
    } catch (ex) {
      setQuiz(null);
      setErr(ex?.message || "Failed to start quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const current = questions[index];

  const setAnswer = (questionId, selectedIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }));
  };

  const answeredCount = Object.keys(answers).length;

  const submit = async () => {
    setSubmitting(true);
    setErr("");
    try {
      const answerArray = questions.map((q) => ({
        question_id: q.id || q.question_id,
        selected_index: answers[q.id || q.question_id],
      }));
      const data = await api.quizzes.submit(sessionId || quiz?.session_id || quiz?.id, answerArray);
      setResult(data);
    } catch (ex) {
      setErr(ex?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <InlineLoading label="Preparing quiz…" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <ErrorState title="Quiz unavailable" message={err} onRetry={load} />
      </div>
    );
  }

  if (result) {
    return (
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">Results</h1>
            <p className="subtitle">Your submission has been scored.</p>
          </div>
          <div className="row">
            <button className="btn" onClick={() => nav("/leaderboard")}>
              Leaderboard
            </button>
            <button className="btn btn-primary" onClick={() => nav("/quizzes")}>
              Back to quizzes
            </button>
          </div>
        </div>

        <div className="grid cols-2">
          <div className="card">
            <h3 className="card-title">Score</h3>
            <div className="kpi">
              <div className="kpi-value">{result?.score ?? "—"}</div>
              <div className="kpi-label">points</div>
            </div>
            <p className="card-muted">
              {typeof result?.correct === "number" && typeof result?.total === "number"
                ? `${result.correct} / ${result.total} correct`
                : "Detailed scoring will appear once the backend is connected."}
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">Summary</h3>
            <p className="card-muted">
              Great work. You can retry quizzes any time to improve your ranking.
            </p>
            <div className="row" style={{ marginTop: 10 }}>
              <span className="badge success">{answeredCount} answered</span>
              <span className="badge">{questions.length} total</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container">
        <ErrorState title="No questions found" message="This quiz has no questions yet." onRetry={load} />
      </div>
    );
  }

  const currentId = current.id || current.question_id;
  const selected = answers[currentId];

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">{quiz?.title || quiz?.name || "Quiz"}</h1>
          <p className="subtitle">
            Question {index + 1} of {questions.length} • Answered {answeredCount}
          </p>
        </div>
        <div className="row">
          <button className="btn" onClick={() => nav("/quizzes")}>
            Exit
          </button>
          <button className="btn btn-primary" disabled={answeredCount !== questions.length || submitting} onClick={submit} title={answeredCount !== questions.length ? "Answer all questions to submit" : ""}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h3 className="card-title" style={{ marginTop: 0 }}>
            {current.prompt || current.question || "Question"}
          </h3>
          <p className="card-muted" style={{ marginTop: 0 }}>
            Select one option.
          </p>
          <div className="hr" />
          <div className="list">
            {(current.options || current.choices || []).map((opt, i) => (
              <div className="list-item" key={i}>
                <div style={{ minWidth: 0 }}>
                  <div className="list-title">{String(opt)}</div>
                  <div className="list-subtitle">{selected === i ? "Selected" : " "}</div>
                </div>
                <button className={`btn ${selected === i ? "btn-primary" : ""}`} onClick={() => setAnswer(currentId, i)} aria-pressed={selected === i}>
                  {selected === i ? "✓" : "Choose"}
                </button>
              </div>
            ))}
          </div>

          <div className="row space" style={{ marginTop: 14 }}>
            <button className="btn" onClick={() => setIndex((v) => Math.max(0, v - 1))} disabled={index === 0}>
              Previous
            </button>

            <div className="row">
              <span className="badge">{current.difficulty || quiz?.difficulty || "mixed"}</span>
              <span className="badge success">{selected !== undefined ? "answered" : "unanswered"}</span>
            </div>

            <button className="btn btn-primary" onClick={() => setIndex((v) => Math.min(questions.length - 1, v + 1))} disabled={index === questions.length - 1}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

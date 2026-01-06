import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { EmptyState, ErrorState, InlineLoading } from "../components/States";
import { validateQuestionDraft } from "../utils/validation";

const emptyDraft = () => ({
  prompt: "",
  options: ["", "", "", ""],
  correct_index: 0,
  difficulty: "easy",
});

// PUBLIC_INTERFACE
export function AdminQuestionsPage() {
  /** Admin UI for question bank CRUD. Requires admin role via ProtectedRoute. */
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // question object or null
  const [draft, setDraft] = useState(emptyDraft());
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((it) => (it.prompt || it.question || "").toLowerCase().includes(needle));
  }, [items, q]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api.questions.list({ q: "" });
      const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setItems(list);
    } catch (ex) {
      setItems([]);
      setErr(ex?.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setDraft({
      prompt: item.prompt || item.question || "",
      options: Array.isArray(item.options || item.choices) ? (item.options || item.choices) : ["", "", "", ""],
      correct_index: item.correct_index ?? item.correctIndex ?? 0,
      difficulty: item.difficulty || "easy",
    });
    setModalOpen(true);
  };

  const save = async () => {
    const errors = validateQuestionDraft(draft);
    if (errors.length) {
      setErr(errors.join(" "));
      return;
    }

    setErr("");
    setSaving(true);
    try {
      const payload = {
        prompt: draft.prompt.trim(),
        options: draft.options.map((o) => o.trim()),
        correct_index: Number(draft.correct_index),
        difficulty: draft.difficulty,
      };

      if (editing) {
        await api.questions.update(editing.id || editing.question_id, payload);
      } else {
        await api.questions.create(payload);
      }
      setModalOpen(false);
      await load();
    } catch (ex) {
      setErr(ex?.message || "Failed to save question.");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (item) => setConfirmDelete(item);

  const doDelete = async () => {
    const item = confirmDelete;
    setConfirmDelete(null);
    if (!item) return;

    try {
      await api.questions.remove(item.id || item.question_id);
      await load();
    } catch (ex) {
      setErr(ex?.message || "Failed to delete question.");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Question Bank</h1>
          <p className="subtitle">Create, edit, and remove questions used by quizzes.</p>
        </div>
        <div className="row">
          <button className="btn" onClick={load}>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            New question
          </button>
        </div>
      </div>

      {err ? <div style={{ marginBottom: 12 }}><ErrorState title="Action failed" message={err} /></div> : null}

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row space">
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="small">Search</label>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by prompt…" />
          </div>
          <div className="row">
            <span className="chip">
              <span className="badge">{items.length}</span>
              <span>total</span>
            </span>
          </div>
        </div>
      </div>

      {loading ? <InlineLoading label="Loading questions…" /> : null}

      {!loading && !err && items.length === 0 ? (
        <EmptyState
          title="No questions yet"
          message="Create your first question to start building quizzes."
          action={<button className="btn btn-primary" onClick={openCreate}>Create question</button>}
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="list">
          {filtered.map((it) => (
            <div className="list-item" key={it.id || it.question_id}>
              <div style={{ minWidth: 0 }}>
                <div className="list-title">{it.prompt || it.question || "Untitled"}</div>
                <div className="list-subtitle">
                  <span className="badge">{it.difficulty || "easy"}</span>
                  <span className="badge success" style={{ marginLeft: 8 }}>
                    correct: {(it.correct_index ?? it.correctIndex ?? 0) + 1}
                  </span>
                </div>
              </div>
              <div className="row">
                <button className="btn" onClick={() => openEdit(it)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => requestDelete(it)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {modalOpen ? (
        <Modal
          title={editing ? "Edit question" : "New question"}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div>
              <label className="small">Prompt</label>
              <textarea className="textarea" value={draft.prompt} onChange={(e) => setDraft((d) => ({ ...d, prompt: e.target.value }))} />
            </div>

            <div className="form-row">
              <div>
                <label className="small">Difficulty</label>
                <select className="select" value={draft.difficulty} onChange={(e) => setDraft((d) => ({ ...d, difficulty: e.target.value }))}>
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </div>
              <div>
                <label className="small">Correct option</label>
                <select
                  className="select"
                  value={String(draft.correct_index)}
                  onChange={(e) => setDraft((d) => ({ ...d, correct_index: Number(e.target.value) }))}
                >
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </select>
              </div>
            </div>

            <div className="grid cols-2">
              {draft.options.map((opt, idx) => (
                <div key={idx}>
                  <label className="small">Option {idx + 1}</label>
                  <input
                    className="input"
                    value={opt}
                    onChange={(e) =>
                      setDraft((d) => {
                        const next = [...d.options];
                        next[idx] = e.target.value;
                        return { ...d, options: next };
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="notice">
              <div style={{ fontWeight: 800 }}>Validation</div>
              <div className="small">
                Exactly 4 unique options are required, and you must select the correct option.
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {confirmDelete ? (
        <ConfirmDialog
          title="Delete question?"
          message="This will remove the question from the bank. This action cannot be undone."
          confirmText="Delete"
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={doDelete}
        />
      ) : null}
    </div>
  );
}

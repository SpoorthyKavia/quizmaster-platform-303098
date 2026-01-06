import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { ErrorState, InlineLoading } from "../components/States";

// PUBLIC_INTERFACE
export function ProfilePage() {
  /** Profile page to view/update user attributes. */
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState(user?.display_name || "");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api.profile.get();
      const u = data?.user || data;
      setDisplayName(u?.display_name || user?.display_name || "");
    } catch (ex) {
      setErr(ex?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setErr("");
    setSaving(true);
    try {
      await api.profile.update({ display_name: displayName.trim() });
    } catch (ex) {
      setErr(ex?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Profile</h1>
          <p className="subtitle">Manage your account details.</p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving || loading}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {loading ? <InlineLoading label="Loading profile…" /> : null}
      {!loading && err ? <ErrorState title="Profile unavailable" message={err} onRetry={load} /> : null}

      {!loading ? (
        <div className="grid cols-2" style={{ marginTop: 14 }}>
          <div className="card">
            <h3 className="card-title">User</h3>
            <div className="form-grid">
              <div>
                <label className="small">Email</label>
                <input className="input" value={user?.email || ""} disabled />
              </div>
              <div>
                <label className="small">Display name</label>
                <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="small">
                Role: <span className="badge">{user?.role || "user"}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Account</h3>
            <p className="card-muted">
              If Supabase is enabled, update profile fields in Supabase user metadata on the backend integration step.
              For now, this page calls <code>/profile</code> endpoints on the API base URL.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

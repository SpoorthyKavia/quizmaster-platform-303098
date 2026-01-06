import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function NotFoundPage() {
  /** 404 page. */
  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="h1">Page not found</h1>
          <p className="subtitle">The page you requested does not exist.</p>
        </div>
      </div>

      <div className="card">
        <p className="card-muted">Use the navigation or go back to the dashboard.</p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link to="/dashboard" className="btn btn-primary">
            Dashboard
          </Link>
          <Link to="/quizzes" className="btn">
            Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}

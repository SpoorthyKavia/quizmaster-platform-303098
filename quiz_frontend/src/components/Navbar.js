import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export function Navbar() {
  /** Top navigation bar for authenticated experience. */
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand" aria-label="Go to dashboard">
          <span className="brand-badge">Q</span>
          <span>QuizMaster</span>
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="nav-links" aria-label="Primary">
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Dashboard
              </NavLink>
              <NavLink to="/quizzes" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Quizzes
              </NavLink>
              <NavLink to="/questions" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Questions (Admin)
              </NavLink>
              <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Leaderboard
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
              </NavLink>
            </nav>

            <div className="nav-spacer" />

            <div className="nav-right">
              <span className="chip" title="Current user">
                <span className="badge success">Signed in</span>
                <span>{user?.display_name || user?.email || "User"}</span>
              </span>
              <button className="btn" onClick={logout}>
                Sign out
              </button>
            </div>
          </>
        ) : (
          <div className="nav-spacer" />
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FullPageLoading } from "../components/States";

// PUBLIC_INTERFACE
export function ProtectedRoute({ requireAdmin = false }) {
  /** Protects child routes; optionally requires admin role. */
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoading label="Loading session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { AuthProvider, useAuth } from "./auth/AuthContext";
import { authService } from "./auth/authService";
import { config } from "./config";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { FullPageLoading } from "./components/States";

import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

import { DashboardPage } from "./pages/DashboardPage";
import { QuizzesPage } from "./pages/QuizzesPage";
import { QuizTakePage } from "./pages/QuizTakePage";
import { AdminQuestionsPage } from "./pages/AdminQuestionsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function AppRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <FullPageLoading label="Loading app…" />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/quizzes/:quizId/take" element={<QuizTakePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/questions" element={<AdminQuestionsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/**
 * Logs Supabase configuration status once at app startup.
 * This is intentionally minimal and does not change app behavior.
 */
function useSupabaseStartupDiagnostics() {
  useEffect(() => {
    // Minimal runtime check requested: confirms the app is reading CRA env vars
    // and the auth service will use Supabase (avoiding backend /auth/* fallback 404s).
    const enabled = authService.isSupabaseEnabled();

    // Avoid printing secrets; only log boolean presence.
    console.info("[QuizMaster] Auth wiring:", {
      supabaseEnabled: enabled,
      hasSupabaseUrl: Boolean(config.supabaseUrl),
      hasSupabaseAnonKey: Boolean(config.supabaseAnonKey),
      // Helpful if emailRedirectTo is used during signup.
      siteUrlConfigured: config.siteUrl || "",
    });
  }, []);
}

// PUBLIC_INTERFACE
function App() {
  /** App entry: provides auth and routing, and renders top navigation. */
  useSupabaseStartupDiagnostics();

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

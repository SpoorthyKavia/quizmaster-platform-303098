import { apiRequest } from "./http";

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints (backend-JWT placeholder). Supabase auth may bypass these. */
  auth: {
    login: (email, password) => apiRequest("/auth/login", { method: "POST", body: { email, password } }),
    signup: (email, password, displayName) =>
      apiRequest("/auth/signup", { method: "POST", body: { email, password, display_name: displayName } }),
    me: () => apiRequest("/auth/me"),
  },

  /** Question bank CRUD (admin). */
  questions: {
    list: ({ q = "" } = {}) => apiRequest(`/questions${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    get: (id) => apiRequest(`/questions/${encodeURIComponent(id)}`),
    create: (question) => apiRequest("/questions", { method: "POST", body: question }),
    update: (id, question) => apiRequest(`/questions/${encodeURIComponent(id)}`, { method: "PUT", body: question }),
    remove: (id) => apiRequest(`/questions/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },

  /** Quiz taking flow. */
  quizzes: {
    list: () => apiRequest("/quizzes"),
    start: (quizId) => apiRequest(`/quizzes/${encodeURIComponent(quizId)}/start`, { method: "POST" }),
    submit: (sessionId, answers) =>
      apiRequest(`/quiz-sessions/${encodeURIComponent(sessionId)}/submit`, { method: "POST", body: { answers } }),
  },

  /** Leaderboard */
  leaderboard: {
    get: () => apiRequest("/leaderboard"),
  },

  /** Profile */
  profile: {
    get: () => apiRequest("/profile"),
    update: (patch) => apiRequest("/profile", { method: "PATCH", body: patch }),
  },
};

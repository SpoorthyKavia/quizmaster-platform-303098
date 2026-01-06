import { config } from "../config";
import { tokenStorage } from "../auth/tokenStorage";

/**
 * Simple HTTP helper around fetch.
 * - Adds Authorization header when token exists
 * - Normalizes error handling
 */

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", body, headers = {}, signal } = {}) {
  /** Public API wrapper for making requests to the backend. */
  const url = `${config.apiBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = tokenStorage.getAccessToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let payload = null;
  try {
    payload = isJson ? await res.json() : await res.text();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const message =
      (payload && payload.message) ||
      (typeof payload === "string" && payload) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  return payload;
}

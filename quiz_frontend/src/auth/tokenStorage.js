/**
 * Token storage abstraction.
 * Keep localStorage interaction isolated so we can swap it later if needed.
 */

const KEY = "quizmaster_access_token";

// PUBLIC_INTERFACE
export const tokenStorage = {
  /** Get access token or empty string. */
  getAccessToken: () => {
    try {
      return window.localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  },

  /** Set access token (string). */
  setAccessToken: (token) => {
    try {
      window.localStorage.setItem(KEY, token);
    } catch {
      // no-op
    }
  },

  /** Clear token. */
  clear: () => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // no-op
    }
  },
};

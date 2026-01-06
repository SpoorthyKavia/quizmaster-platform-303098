/**
 * Central configuration for frontend.
 * Uses CRA environment variables (REACT_APP_*).
 */

const readEnv = (key, fallback = undefined) => {
  const v = process.env[key];
  if (v === undefined || v === null || v === "") return fallback;
  return v;
};

// PUBLIC_INTERFACE
export const config = {
  /** Base URL for the backend API (FastAPI). Example: http://localhost:3001 */
  apiBaseUrl: readEnv("REACT_APP_API_BASE_URL", "http://localhost:3001"),

  /**
   * If both Supabase URL + anon key are present, the app will use Supabase auth.
   * Otherwise it will fall back to a lightweight backend-JWT placeholder.
   */
  supabaseUrl: readEnv("REACT_APP_SUPABASE_URL", ""),
  supabaseAnonKey: readEnv("REACT_APP_SUPABASE_ANON_KEY", ""),

  /**
   * Used for Supabase emailRedirectTo (if enabled).
   * Deployment agent will map this to the final URL.
   */
  siteUrl: readEnv("REACT_APP_SITE_URL", "http://localhost:3000"),
};

import { api } from "../api/client";
import { config } from "../config";
import { tokenStorage } from "./tokenStorage";
import { getSupabaseClient } from "./supabaseClient";

function isSupabaseEnabled() {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey && getSupabaseClient());
}

async function backendLogin(email, password) {
  const data = await api.auth.login(email, password);
  // Expected shape (backend later): { access_token, user: { id, email, display_name, role } }
  if (data && data.access_token) tokenStorage.setAccessToken(data.access_token);
  return data;
}

async function backendSignup(email, password, displayName) {
  const data = await api.auth.signup(email, password, displayName);
  if (data && data.access_token) tokenStorage.setAccessToken(data.access_token);
  return data;
}

async function backendLogout() {
  tokenStorage.clear();
  return true;
}

// PUBLIC_INTERFACE
export const authService = {
  /** True if Supabase Auth is configured in environment. */
  isSupabaseEnabled: () => isSupabaseEnabled(),

  /** Attempt to restore session on app start. */
  init: async () => {
    if (isSupabaseEnabled()) {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const session = data?.session || null;
      const user = session?.user
        ? { id: session.user.id, email: session.user.email || "", display_name: session.user.user_metadata?.full_name || "" }
        : null;
      return { user, access_token: session?.access_token || "" };
    }

    const token = tokenStorage.getAccessToken();
    if (!token) return { user: null, access_token: "" };

    try {
      const me = await api.auth.me();
      return { user: me?.user || me || null, access_token: token };
    } catch {
      tokenStorage.clear();
      return { user: null, access_token: "" };
    }
  },

  /** Login with email/password. */
  login: async (email, password) => {
    if (isSupabaseEnabled()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return {
        access_token: data.session?.access_token || "",
        user: data.user ? { id: data.user.id, email: data.user.email || "", display_name: data.user.user_metadata?.full_name || "" } : null,
      };
    }
    return backendLogin(email, password);
  },

  /** Signup with email/password. */
  signup: async (email, password, displayName) => {
    if (isSupabaseEnabled()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: displayName },
          emailRedirectTo: `${config.siteUrl}/auth/callback`,
        },
      });
      if (error) throw error;
      return {
        access_token: data.session?.access_token || "",
        user: data.user ? { id: data.user.id, email: data.user.email || "", display_name: displayName || "" } : null,
      };
    }
    return backendSignup(email, password, displayName);
  },

  /** Logout current session. */
  logout: async () => {
    if (isSupabaseEnabled()) {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      return true;
    }
    return backendLogout();
  },
};

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "./authService";
import { tokenStorage } from "./tokenStorage";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (user/session) and actions to the app. */
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { user: u, access_token } = await authService.init();
        if (!mounted) return;
        setUser(u);
        setAccessToken(access_token || "");
        if (access_token) tokenStorage.setAccessToken(access_token);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      loading,
      user,
      accessToken,
      isAuthenticated: Boolean(user),

      // PUBLIC_INTERFACE
      login: async (email, password) => {
        const data = await authService.login(email, password);
        if (data?.access_token) tokenStorage.setAccessToken(data.access_token);
        setAccessToken(data?.access_token || "");
        setUser(data?.user || null);
        return data;
      },

      // PUBLIC_INTERFACE
      signup: async (email, password, displayName) => {
        const data = await authService.signup(email, password, displayName);
        if (data?.access_token) tokenStorage.setAccessToken(data.access_token);
        setAccessToken(data?.access_token || "");
        setUser(data?.user || null);
        return data;
      },

      // PUBLIC_INTERFACE
      logout: async () => {
        await authService.logout();
        tokenStorage.clear();
        setAccessToken("");
        setUser(null);
      },
    }),
    [loading, user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

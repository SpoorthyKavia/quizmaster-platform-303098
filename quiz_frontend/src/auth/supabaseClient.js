import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

let supabase = null;

if (config.supabaseUrl && config.supabaseAnonKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a Supabase client if configured, otherwise null. */
  return supabase;
}

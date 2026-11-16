import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ohsdavpfsquxmrfkrglv.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_S1ABhJO0qvuuzp7zUMHaJw_9-RIoTeI";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

/** Apakah kredensial Supabase Cloud sudah diisi di .env.local? */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id")
);

/** Client Supabase untuk penggunaan di Browser / Client Component. */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/** Client Supabase dengan hak penuh untuk Route Handlers (Server). */
export function getServerSupabase() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}


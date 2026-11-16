/**
 * Autentikasi Terintegrasi Supabase Auth (Google OAuth + Email/Password) & PostgreSQL.
 */
import { useEffect } from "react";
import { createStore } from "@/lib/createStore";
import { supabase } from "@/lib/supabase";
import { dataStore, syncFromBackend, useData } from "@/services/dataService";

const MAX_ATTEMPTS = 5; // AUTH-7
const LOCK_MINUTES = 15;

const sessionStore = createStore("pbag-session-v1", () => ({ userId: null, user: null }));
const attemptStore = createStore("pbag-login-attempts-v1", () => ({}));

export const ROLE_HOME = {
  admin: "/admin",
  pengguna: "/beranda",
};

export const ROLE_LABEL = {
  admin: "Administrator",
  pengguna: "Pengguna",
};

let authListenerAttached = false;

async function syncOAuthSession(sbUser) {
  if (!sbUser?.email) return;
  const nama =
    sbUser.user_metadata?.full_name ||
    sbUser.user_metadata?.name ||
    sbUser.email.split("@")[0];

  try {
    const res = await fetch("/api/auth/oauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: sbUser.id,
        email: sbUser.email,
        nama,
      }),
    });
    const json = await res.json();
    if (res.ok && json.ok && json.user) {
      sessionStore.setState({ userId: json.user.id, user: json.user });
      syncFromBackend();
    }
  } catch (err) {
    console.error("Gagal menyinkronkan sesi OAuth:", err);
  }
}

/**
 * @returns {{ ready: boolean, user: object|null }}
 */
export function useAuth() {
  const session = sessionStore.useStore();
  const data = useData();

  useEffect(() => {
    if (authListenerAttached || !supabase) return;
    authListenerAttached = true;

    // Cek sesi Supabase Auth saat halaman dibuka (terutama setelah redirect dari Google OAuth)
    supabase.auth.getSession().then(({ data: sData }) => {
      if (sData?.session?.user) {
        syncOAuthSession(sData.session.user);
      }
    });

    supabase.auth.onAuthStateChange((event, sbSession) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && sbSession?.user) {
        syncOAuthSession(sbSession.user);
      } else if (event === "SIGNED_OUT") {
        sessionStore.setState({ userId: null, user: null });
      }
    });
  }, []);

  if (session === undefined || data === undefined) return { ready: false, user: null };
  const user =
    data.users.find((u) => u.id === session.userId) || session.user || null;
  return { ready: true, user };
}

export async function login(email, password) {
  const key = email.trim().toLowerCase();
  const attempts = attemptStore.getState();
  const record = attempts[key] || { count: 0, lockedUntil: 0 };

  if (record.lockedUntil && record.lockedUntil > Date.now()) {
    const menit = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return { ok: false, error: `Terlalu banyak percobaan. Coba lagi dalam ${menit} menit.` };
  }

  let matchedUser = null;
  let serverMessage = null;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: key, password }),
    });
    const json = await res.json();
    if (res.ok && json.ok && json.user) {
      matchedUser = json.user;
    } else if (json.error) {
      serverMessage = json.error;
    }
  } catch {
    const localUser = dataStore
      .getState()
      .users.find((u) => u.email.toLowerCase() === key);
    if (localUser && (localUser.password === password || localUser.password_hash === password)) {
      matchedUser = localUser;
    }
  }

  if (!matchedUser) {
    const count = record.count + 1;
    const locked = count >= MAX_ATTEMPTS;
    attemptStore.setState({
      ...attempts,
      [key]: {
        count: locked ? 0 : count,
        lockedUntil: locked ? Date.now() + LOCK_MINUTES * 60000 : 0,
      },
    });
    return {
      ok: false,
      error: locked
        ? `Akun dikunci ${LOCK_MINUTES} menit karena ${MAX_ATTEMPTS}x gagal masuk.`
        : `${serverMessage || "Email atau password salah."} Sisa percobaan: ${MAX_ATTEMPTS - count}.`,
    };
  }

  const rest = { ...attempts };
  delete rest[key];
  attemptStore.setState(rest);
  sessionStore.setState({ userId: matchedUser.id, user: matchedUser });
  syncFromBackend();
  return { ok: true, user: matchedUser };
}

/** Pendaftaran akun baru dengan email asli. */
export async function register({ nama, email, password }) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      return { ok: false, error: json.error || "Gagal mendaftarkan akun." };
    }
    sessionStore.setState({ userId: json.user.id, user: json.user });
    syncFromBackend();
    return { ok: true, user: json.user };
  } catch (err) {
    return { ok: false, error: err.message || "Gagal terhubung ke server." };
  }
}

/** Masuk dengan Akun Google melalui Supabase OAuth. */
export async function loginWithGoogle() {
  if (!supabase) {
    return { ok: false, error: "Supabase belum dikonfigurasi." };
  }
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function logout() {
  sessionStore.setState({ userId: null, user: null });
  if (supabase) {
    await supabase.auth.signOut().catch(() => {});
  }
}

export async function requestPasswordReset(email) {
  const cleanEmail = email.trim().toLowerCase();
  if (supabase) {
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
    await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo }).catch(() => {});
  }
  const exists = dataStore
    .getState()
    .users.some((u) => u.email.toLowerCase() === cleanEmail);
  return { ok: true, exists };
}

/**
 * Autentikasi Terintegrasi Backend (`/api/auth/login` -> Supabase PostgreSQL).
 */
import { createStore } from "@/lib/createStore";
import { dataStore, useData } from "@/services/dataService";

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

/**
 * @returns {{ ready: boolean, user: object|null }}
 */
export function useAuth() {
  const session = sessionStore.useStore();
  const data = useData();
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

  // 1. Verifikasi ke Backend API (/api/auth/login -> Supabase Cloud)
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: key, password }),
    });
    const json = await res.json();
    if (res.ok && json.ok && json.user) {
      matchedUser = json.user;
    }
  } catch {
    // Fallback ke pengecekan lokal bila sedang offline
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
        : `Email atau password salah. Sisa percobaan: ${MAX_ATTEMPTS - count}.`,
    };
  }

  const rest = { ...attempts };
  delete rest[key];
  attemptStore.setState(rest);
  sessionStore.setState({ userId: matchedUser.id, user: matchedUser });
  return { ok: true, user: matchedUser };
}

export function logout() {
  sessionStore.setState({ userId: null, user: null });
}

export function requestPasswordReset(email) {
  const exists = dataStore
    .getState()
    .users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  return { ok: true, exists };
}

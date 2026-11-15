/**
 * Autentikasi mock (PRD 6.1). Sesi disimpan di localStorage.
 * Ganti dengan NextAuth / Supabase Auth saat backend tersedia.
 */
import { createStore } from "@/lib/createStore";
import { dataStore, useData } from "@/services/dataService";

const MAX_ATTEMPTS = 5; // AUTH-7
const LOCK_MINUTES = 15;

const sessionStore = createStore("pbag-session-v1", () => ({ userId: null }));
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
  const user = data.users.find((u) => u.id === session.userId) || null;
  return { ready: true, user };
}

export function login(email, password) {
  const key = email.trim().toLowerCase();
  const attempts = attemptStore.getState();
  const record = attempts[key] || { count: 0, lockedUntil: 0 };

  if (record.lockedUntil && record.lockedUntil > Date.now()) {
    const menit = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return { ok: false, error: `Terlalu banyak percobaan. Coba lagi dalam ${menit} menit.` };
  }

  const user = dataStore.getState().users.find((u) => u.email.toLowerCase() === key);
  if (!user || user.password !== password) {
    const count = record.count + 1;
    const locked = count >= MAX_ATTEMPTS;
    attemptStore.setState({
      ...attempts,
      [key]: { count: locked ? 0 : count, lockedUntil: locked ? Date.now() + LOCK_MINUTES * 60000 : 0 },
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
  sessionStore.setState({ userId: user.id });
  return { ok: true, user };
}

export function logout() {
  sessionStore.setState({ userId: null });
}

/** AUTH-4 (mock): di backend asli kirim email berisi tautan reset. */
export function requestPasswordReset(email) {
  const exists = dataStore
    .getState()
    .users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  return { ok: true, exists };
}


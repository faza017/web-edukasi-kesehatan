/**
 * Store sederhana berbasis localStorage + useSyncExternalStore.
 *
 * Ini adalah lapisan data MOCK untuk MVP frontend. Saat backend siap
 * (mis. Next.js Route Handlers / Server Actions + Supabase), cukup ganti
 * implementasi di `src/services/*` tanpa mengubah komponen halaman.
 */
import { useSyncExternalStore } from "react";

export function createStore(key, createInitial) {
  let state; // cache di memori (undefined = belum dimuat)
  const listeners = new Set();

  function load() {
    if (state !== undefined) return state;
    try {
      const raw = window.localStorage.getItem(key);
      state = raw ? JSON.parse(raw) : createInitial();
    } catch {
      state = createInitial();
    }
    return state;
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  function subscribe(listener) {
    listeners.add(listener);
    const onStorage = (e) => {
      if (e.key === key) {
        state = undefined; // sinkron antar-tab
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function setState(updater) {
    const next = typeof updater === "function" ? updater(load()) : updater;
    state = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.error("Gagal menyimpan ke localStorage:", err);
      throw new Error("Penyimpanan penuh. Coba unggah berkas yang lebih kecil.");
    }
    emit();
  }

  function reset() {
    state = createInitial();
    window.localStorage.setItem(key, JSON.stringify(state));
    emit();
  }

  /** Hook React. Mengembalikan `undefined` saat render di server / sebelum hidrasi. */
  function useStore() {
    return useSyncExternalStore(subscribe, load, () => undefined);
  }

  return { getState: load, setState, reset, useStore };
}


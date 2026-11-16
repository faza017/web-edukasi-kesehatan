/**
 * In-Memory Reactive Store berbasis useSyncExternalStore.
 *
 * Penyimpanan utama kini berada di database Supabase PostgreSQL.
 * Store ini menjaga state reaktif di memori browser agar seluruh komponen
 * UI langsung merender ulang saat data dari Supabase dimuat atau diperbarui.
 * Jika `storageKey` diberikan (mis. untuk sesi login), barulah disinkronkan ke localStorage.
 */
import { useSyncExternalStore } from "react";

export function createStore(storageKey, createInitial) {
  let state;
  const listeners = new Set();

  function load() {
    if (state !== undefined) return state;
    if (storageKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(storageKey);
        state = raw ? JSON.parse(raw) : createInitial();
        return state;
      } catch {
        // lanjut ke createInitial
      }
    }
    state = createInitial();
    return state;
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  function subscribe(listener) {
    listeners.add(listener);
    if (!storageKey || typeof window === "undefined") {
      return () => listeners.delete(listener);
    }
    const onStorage = (e) => {
      if (e.key === storageKey) {
        state = undefined;
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
    if (storageKey && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.error("Gagal menyimpan sesi:", err);
      }
    }
    emit();
  }

  function reset() {
    state = createInitial();
    if (storageKey && typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
    emit();
  }

  function useStore() {
    return useSyncExternalStore(subscribe, load, () => undefined);
  }

  return { getState: load, setState, reset, useStore };
}

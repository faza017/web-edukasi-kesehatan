/**
 * Layanan Data Utama — Terhubung penuh ke Supabase PostgreSQL melalui `/api/portal`.
 *
 * Penyimpanan data utama (Jurnal, Kategori, Dokter, Jadwal Dokter, Kegiatan, Pengaturan)
 * TIDAK lagi disimpan di Local Storage (`storageKey = null`), melainkan langsung
 * dimuat dan disimpan ke database Supabase Cloud.
 */
import { useEffect } from "react";
import { createStore } from "@/lib/createStore";
import { createSeed } from "@/data/seed";
import { dayName, timeToMinutes } from "@/lib/date";
import { slugify, uid } from "@/lib/utils";

// storageKey = null -> Data utama hanya di memori + Supabase Cloud (bukan di Local Storage)
export const dataStore = createStore(null, createSeed);

let initialSyncStarted = false;

export async function syncFromBackend() {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/portal", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (json?.data) {
      dataStore.setState(json.data);
    }
  } catch (err) {
    console.error("Gagal memuat data dari Supabase:", err);
  }
}

async function pushToBackend(action, payload) {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        payload,
        snapshot: dataStore.getState(),
      }),
    });
    const json = await res.json();
    if (res.ok && json?.data) {
      dataStore.setState(json.data);
    }
    return json;
  } catch (err) {
    console.error("Gagal menyinkronkan ke Supabase:", err);
    return { ok: false, error: err.message };
  }
}

/** Hook utama untuk membaca seluruh data & otomatis memuat dari Supabase `/api/portal`. */
export function useData() {
  const storeData = dataStore.useStore();

  useEffect(() => {
    if (!initialSyncStarted) {
      initialSyncStarted = true;
      // Bersihkan sisa key localStorage lama dari versi prototipe
      try {
        window.localStorage.removeItem("pbag-data-v1");
        window.localStorage.removeItem("pbag-data-v2");
      } catch {
        // abaikan
      }
      syncFromBackend();
    }
  }, []);

  return storeData;
}

const update = (fn) => dataStore.setState((s) => ({ ...s, ...fn(s) }));

/* ------------------------------------------------------------------ */
/* Jurnal                                                              */
/* ------------------------------------------------------------------ */

function uniqueSlug(jurnal, judul, excludeId) {
  const base = slugify(judul) || "jurnal";
  let slug = base;
  let i = 2;
  while (jurnal.some((j) => j.slug === slug && j.id !== excludeId)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

export function createJurnal(payload) {
  const id = uid("j");
  let createdItem = null;
  update((s) => {
    createdItem = {
      ...payload,
      id,
      slug: uniqueSlug(s.jurnal, payload.judul),
      tanggalTerbit: payload.status === "terbit" ? payload.tanggalTerbit : null,
    };
    return { jurnal: [createdItem, ...s.jurnal] };
  });
  pushToBackend("jurnal:upsert", createdItem);
  return id;
}

export function updateJurnal(id, payload) {
  let updatedItem = null;
  update((s) => ({
    jurnal: s.jurnal.map((j) => {
      if (j.id !== id) return j;
      updatedItem = {
        ...j,
        ...payload,
        slug: uniqueSlug(s.jurnal, payload.judul ?? j.judul, id),
      };
      return updatedItem;
    }),
  }));
  if (updatedItem) pushToBackend("jurnal:upsert", updatedItem);
}

export function deleteJurnal(id) {
  update((s) => ({ jurnal: s.jurnal.filter((j) => j.id !== id) }));
  pushToBackend("jurnal:delete", { id });
}

export function setJurnalStatus(id, status, tanggalTerbit) {
  let updatedItem = null;
  update((s) => ({
    jurnal: s.jurnal.map((j) => {
      if (j.id !== id) return j;
      updatedItem = {
        ...j,
        status,
        tanggalTerbit:
          status === "terbit" ? j.tanggalTerbit || tanggalTerbit : j.tanggalTerbit,
      };
      return updatedItem;
    }),
  }));
  if (updatedItem) pushToBackend("jurnal:upsert", updatedItem);
}

/* ------------------------------------------------------------------ */
/* Kategori                                                            */
/* ------------------------------------------------------------------ */

export function createKategori(nama) {
  const slug = slugify(nama);
  const { kategori } = dataStore.getState();
  if (!slug) throw new Error("Nama kategori wajib diisi.");
  if (kategori.some((k) => k.slug === slug)) throw new Error("Kategori sudah ada.");
  const newItem = { id: uid("k"), nama: nama.trim(), slug };
  update((s) => ({ kategori: [...s.kategori, newItem] }));
  pushToBackend("kategori:create", newItem);
}

export function deleteKategori(id) {
  const { jurnal } = dataStore.getState();
  if (jurnal.some((j) => j.kategoriId === id)) {
    throw new Error("Kategori masih dipakai oleh jurnal. Pindahkan jurnal terlebih dahulu.");
  }
  update((s) => ({ kategori: s.kategori.filter((k) => k.id !== id) }));
  pushToBackend("kategori:delete", { id });
}

/* ------------------------------------------------------------------ */
/* Jadwal Dokter                                                       */
/* ------------------------------------------------------------------ */

/** Cari jadwal bentrok untuk dokter yang sama (PRD KD-3). */
export function findBentrok(list, jadwal, excludeId) {
  const nama = jadwal.dokterNama.trim().toLowerCase();
  const hari = jadwal.tanggal ? dayName(jadwal.tanggal) : jadwal.hari;
  const mulai = timeToMinutes(jadwal.jamMulai);
  const selesai = timeToMinutes(jadwal.jamSelesai);

  return list.find((j) => {
    if (j.id === excludeId) return false;
    if (j.dokterNama.trim().toLowerCase() !== nama) return false;
    const sameDay =
      j.tanggal && jadwal.tanggal
        ? j.tanggal === jadwal.tanggal
        : (j.tanggal ? dayName(j.tanggal) : j.hari) === hari;
    if (!sameDay) return false;
    return mulai < timeToMinutes(j.jamSelesai) && timeToMinutes(j.jamMulai) < selesai;
  });
}

export function createJadwalDokter(payload) {
  const newItem = { ...payload, id: uid("jd") };
  update((s) => ({ jadwalDokter: [...s.jadwalDokter, newItem] }));
  pushToBackend("jadwal:upsert", newItem);
}

export function updateJadwalDokter(id, payload) {
  let updatedItem = null;
  update((s) => ({
    jadwalDokter: s.jadwalDokter.map((j) => {
      if (j.id !== id) return j;
      updatedItem = { ...j, ...payload };
      return updatedItem;
    }),
  }));
  if (updatedItem) pushToBackend("jadwal:upsert", updatedItem);
}

export function deleteJadwalDokter(id) {
  update((s) => ({ jadwalDokter: s.jadwalDokter.filter((j) => j.id !== id) }));
  pushToBackend("jadwal:delete", { id });
}

/* ------------------------------------------------------------------ */
/* Kegiatan                                                            */
/* ------------------------------------------------------------------ */

export function createKegiatan(payload) {
  const newItem = { ...payload, id: uid("kg") };
  update((s) => ({ kegiatan: [...s.kegiatan, newItem] }));
  pushToBackend("kegiatan:upsert", newItem);
}

export function updateKegiatan(id, payload) {
  let updatedItem = null;
  update((s) => ({
    kegiatan: s.kegiatan.map((k) => {
      if (k.id !== id) return k;
      updatedItem = { ...k, ...payload };
      return updatedItem;
    }),
  }));
  if (updatedItem) pushToBackend("kegiatan:upsert", updatedItem);
}

export function deleteKegiatan(id) {
  update((s) => ({ kegiatan: s.kegiatan.filter((k) => k.id !== id) }));
  pushToBackend("kegiatan:delete", { id });
}

/* ------------------------------------------------------------------ */
/* Pengaturan                                                          */
/* ------------------------------------------------------------------ */

export function updatePengaturan(payload) {
  let nextPengaturan = null;
  update((s) => {
    nextPengaturan = { ...s.pengaturan, ...payload };
    return { pengaturan: nextPengaturan };
  });
  if (nextPengaturan) pushToBackend("pengaturan:update", nextPengaturan);
}

export function resetDemoData() {
  dataStore.reset();
  pushToBackend("reset", {});
}

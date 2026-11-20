/**
 * Fungsi turunan (selector) untuk menampilkan data di halaman.
 */
import { dayName, timeToMinutes } from "@/lib/date";

/* ---------------- Jurnal ---------------- */

const KATEGORI_DEFAULT_IMG = {
  "k-lansia": "/illustrations/lansia.svg",
  "k-bumil": "/illustrations/bumil.svg",
  "k-balita": "/illustrations/balita.svg",
};

export function kategoriNama(kategori, id) {
  return kategori.find((k) => k.id === id)?.nama || "Kesehatan";
}

export function jurnalImageUrl(jurnal) {
  if (jurnal?.berkas?.dataUrl) {
    const t = jurnal.berkas.type || "";
    const n = (jurnal.berkas.name || "").toLowerCase();
    if (
      t.startsWith("image/") ||
      n.endsWith(".jpg") ||
      n.endsWith(".jpeg") ||
      n.endsWith(".png") ||
      n.endsWith(".webp") ||
      n.endsWith(".svg")
    ) {
      return jurnal.berkas.dataUrl;
    }
  }
  return KATEGORI_DEFAULT_IMG[jurnal?.kategoriId] || "/illustrations/balita.svg";
}

/* ---------------- Lokasi & Google Maps ---------------- */

const MAPS_DELIM = "\n[MAPS]:";

export function packLokasiMaps(lokasi, mapsUrl) {
  const cleanLok = (lokasi || "").trim();
  const cleanUrl = (mapsUrl || "").trim();
  return cleanUrl ? `${cleanLok}${MAPS_DELIM}${cleanUrl}` : cleanLok;
}

export function unpackLokasiMaps(rawLokasi, fallbackMapsUrl = "") {
  const raw = rawLokasi || "";
  if (raw.includes(MAPS_DELIM)) {
    const [lok, url] = raw.split(MAPS_DELIM);
    return { lokasi: lok.trim(), mapsUrl: (url || "").trim() };
  }
  return { lokasi: raw.trim(), mapsUrl: (fallbackMapsUrl || "").trim() };
}

export function jurnalTerbit(jurnal) {
  return jurnal
    .filter((j) => j.status === "terbit")
    .sort((a, b) => (b.tanggalTerbit || "").localeCompare(a.tanggalTerbit || ""));
}

/* ---------------- Jadwal dokter ---------------- */

export const STATUS_JADWAL = {
  aktif: { label: "Aktif", userLabel: "Tersedia", tone: "brand" },
  penuh: { label: "Penuh", userLabel: "Penuh", tone: "amber" },
  dibatalkan: { label: "Dibatalkan", userLabel: "Tidak praktik", tone: "red" },
  tidak_aktif: { label: "Tidak aktif", userLabel: "Tidak aktif", tone: "gray" },
};

/** Semua jadwal yang berlaku tepat pada tanggal tertentu (atau jadwal berulang tanpa tanggal), urut jam mulai. */
export function jadwalPadaTanggal(jadwalDokter, iso) {
  const hari = dayName(iso);
  return jadwalDokter
    .filter((j) => (j.tanggal ? j.tanggal === iso : j.hari === hari))
    .sort((a, b) => timeToMinutes(a.jamMulai) - timeToMinutes(b.jamMulai));
}

/** Jadwal yang boleh dilihat pengguna (PRD JDW-8: status tidak aktif disembunyikan). */
export function jadwalPublik(jadwalDokter, iso) {
  return jadwalPadaTanggal(jadwalDokter, iso).filter((j) => j.status !== "tidak_aktif");
}

/** "Poli Umum — Ruang 01" -> "Poli Umum" */
export function poliDariLokasi(lokasi) {
  return (lokasi || "").split(/\s[—–-]\s/)[0].trim();
}

export function daftarPoli(jadwalDokter) {
  return [...new Set(jadwalDokter.map((j) => poliDariLokasi(j.lokasi)).filter(Boolean))].sort();
}

export function daftarDokter(jadwalDokter, dokterMaster = []) {
  const map = new Map();
  (dokterMaster || []).forEach((d) => {
    const key = d.nama.trim().toLowerCase();
    if (!map.has(key)) map.set(key, { nama: d.nama, spesialisasi: d.spesialisasi });
  });
  (jadwalDokter || []).forEach((j) => {
    const key = j.dokterNama.trim().toLowerCase();
    if (!map.has(key)) map.set(key, { nama: j.dokterNama, spesialisasi: j.spesialisasi });
  });
  return [...map.values()];
}

/** Sesi: Pagi < 12.00 ≤ Siang */
export function sesiJam(jamMulai) {
  return timeToMinutes(jamMulai) < 12 * 60 ? "pagi" : "siang";
}

/* ---------------- Kegiatan ---------------- */

export const JENIS_KEGIATAN = {
  seminar: { label: "Seminar", tone: "brand" },
  pemeriksaan: { label: "Pemeriksaan", tone: "sky" },
  penyuluhan: { label: "Penyuluhan", tone: "amber" },
};


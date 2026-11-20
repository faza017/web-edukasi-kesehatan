import fs from "node:fs";
import path from "node:path";
import { createSeed } from "@/data/seed";
import { getServerSupabase } from "@/lib/supabase";

const LOCAL_DB_PATH = path.join(process.cwd(), ".local-db.json");

function readLocalDb() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
    }
  } catch {
    // Abaikan jika korup, buat ulang dari seed
  }
  const initial = createSeed();
  writeLocalDb(initial);
  return initial;
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Gagal menulis .local-db.json:", err);
  }
}

/** Konversi baris snake_case dari PostgreSQL Supabase ke camelCase aplikasi. */
function mapJurnalRow(r) {
  return {
    id: r.id,
    judul: r.judul,
    slug: r.slug,
    kategoriId: r.kategori_id,
    penulis: r.penulis,
    ringkasan: r.ringkasan,
    isi: r.isi,
    berkas: r.berkas,
    menitBaca: r.menit_baca,
    status: r.status,
    tanggalTerbit: r.tanggal_terbit,
  };
}

function mapJadwalRow(r) {
  return {
    id: r.id,
    dokterNama: r.dokter_nama,
    spesialisasi: r.spesialisasi,
    hari: r.hari,
    tanggal: r.tanggal,
    jamMulai: r.jam_mulai,
    jamSelesai: r.jam_selesai,
    lokasi: r.lokasi,
    kuota: r.kuota,
    status: r.status,
  };
}

function mapKegiatanRow(r) {
  const MAPS_DELIM = "\n[MAPS]:";
  const rawLokasi = r.lokasi || "";
  let lokasi = rawLokasi;
  let mapsUrl = r.maps_url || "";
  if (rawLokasi.includes(MAPS_DELIM)) {
    const [lok, url] = rawLokasi.split(MAPS_DELIM);
    lokasi = lok.trim();
    mapsUrl = (url || "").trim();
  }
  return {
    id: r.id,
    nama: r.nama,
    jenis: r.jenis,
    penyelenggara: r.penyelenggara,
    tanggal: r.tanggal,
    waktuMulai: r.waktu_mulai,
    waktuSelesai: r.waktu_selesai,
    lokasi,
    mapsUrl,
    kuota: r.kuota,
    deskripsi: r.deskripsi,
  };
}

/** Ambil seluruh snapshot data dari Supabase Cloud (atau fallback JSON server). */
export async function getAllPortalData() {
  const sb = getServerSupabase();
  if (!sb) {
    return { mode: "local-server", data: readLocalDb() };
  }

  const [katRes, jurRes, jadRes, kegRes, pengRes, usrRes, dokRes] = await Promise.all([
    sb.from("kategori").select("*").order("nama"),
    sb.from("jurnal").select("*").order("tanggal_terbit", { ascending: false }),
    sb.from("jadwal_dokter").select("*"),
    sb.from("kegiatan").select("*").order("tanggal", { ascending: false }),
    sb.from("pengaturan").select("*"),
    sb.from("users").select("id, nama, email, peran"),
    sb.from("dokter").select("*").order("nama"),
  ]);

  if (katRes.error) {
    console.warn("Supabase belum diinisialisasi, beralih ke local server DB:", katRes.error.message);
    return { mode: "local-server", data: readLocalDb() };
  }

  const seed = createSeed();
  const pengaturan = { ...seed.pengaturan };
  (pengRes.data || []).forEach((row) => {
    pengaturan[row.kunci] = row.nilai;
  });

  return {
    mode: "supabase-cloud",
    data: {
      version: 2,
      users: usrRes.data?.length ? usrRes.data : seed.users,
      kategori: katRes.data || [],
      dokter: dokRes.data || [],
      jurnal: (jurRes.data || []).map(mapJurnalRow),
      jadwalDokter: (jadRes.data || []).map(mapJadwalRow),
      kegiatan: (kegRes.data || []).map(mapKegiatanRow),
      pengaturan,
    },
  };
}

export { readLocalDb, writeLocalDb };


/**
 * Data awal (mock) sesuai frame Figma & PRD Bagian 7 (Model Data).
 * Disimpan ke localStorage saat pertama kali aplikasi dibuka.
 * Nanti dapat diganti dengan database (mis. Supabase/PostgreSQL).
 */
import { todayISO } from "@/lib/date";

export const DEMO_ACCOUNTS = [
  { email: "user@email.com", password: "user123", label: "Pengguna" },
  { email: "admin@puskesmas.id", password: "admin123", label: "Administrator" },
];

const users = [
  {
    id: "u-1",
    nama: "User",
    email: "user@email.com",
    // CATATAN: hanya untuk demo. Di backend asli password WAJIB di-hash (bcrypt/argon2).
    password: "user123",
    peran: "pengguna",
  },
  {
    id: "u-2",
    nama: "Petugas Puskesmas",
    email: "admin@puskesmas.id",
    password: "admin123",
    peran: "admin",
  },
];

const kategori = [
  { id: "k-umum", nama: "Kesehatan umum", slug: "kesehatan-umum" },
  { id: "k-mental", nama: "Kesehatan mental", slug: "kesehatan-mental" },
  { id: "k-gizi", nama: "Gizi", slug: "gizi" },
];

const jurnal = [
  {
    id: "j-1",
    judul: "Pola Hidup Sehat",
    slug: "pola-hidup-sehat",
    kategoriId: "k-umum",
    penulis: "dr. Andi Pratama",
    ringkasan: "5 kebiasaan sederhana untuk menjaga tubuh tetap bugar.",
    isi: "Menjaga kesehatan tidak harus rumit. Mulailah dari lima kebiasaan sederhana berikut.\n\n1. Sarapan bergizi setiap pagi agar energi stabil sepanjang hari.\n2. Minum air putih minimal 8 gelas sehari.\n3. Bergerak aktif minimal 30 menit, misalnya jalan kaki atau bersepeda.\n4. Tidur cukup 7–8 jam setiap malam.\n5. Rutin memeriksakan kesehatan ke puskesmas, terutama tekanan darah dan gula darah.\n\nKebiasaan kecil yang dilakukan secara konsisten akan memberikan dampak besar bagi kesehatan Anda dan keluarga.",
    berkas: null,
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-11-02",
  },
  {
    id: "j-2",
    judul: "Menjaga Kesehatan Mental",
    slug: "menjaga-kesehatan-mental",
    kategoriId: "k-mental",
    penulis: "Tim Promkes Puskesmas",
    ringkasan: "Kenali pentingnya istirahat dan mengelola stres.",
    isi: "Kesehatan mental sama pentingnya dengan kesehatan fisik. Stres yang tidak dikelola dapat memicu gangguan tidur, sakit kepala, hingga menurunnya daya tahan tubuh.\n\nBeberapa cara sederhana mengelola stres:\n- Luangkan waktu istirahat di sela aktivitas.\n- Lakukan teknik napas dalam selama 5 menit.\n- Ceritakan perasaan kepada orang yang dipercaya.\n- Batasi penggunaan gawai sebelum tidur.\n\nBila keluhan berlangsung lebih dari dua minggu dan mengganggu aktivitas, jangan ragu berkonsultasi dengan petugas kesehatan di puskesmas.",
    berkas: null,
    menitBaca: 5,
    status: "terbit",
    tanggalTerbit: "2026-11-01",
  },
  {
    id: "j-3",
    judul: "Nutrisi Seimbang",
    slug: "nutrisi-seimbang",
    kategoriId: "k-gizi",
    penulis: "Ahli Gizi Puskesmas",
    ringkasan: "Panduan sederhana memenuhi kebutuhan nutrisi harian.",
    isi: "Gunakan pedoman \"Isi Piringku\" untuk setiap kali makan: setengah piring berisi sayur dan buah, seperempat piring makanan pokok, dan seperempat piring lauk pauk.\n\nBatasi konsumsi gula (maksimal 4 sendok makan per hari), garam (1 sendok teh per hari), dan minyak (5 sendok makan per hari).",
    berkas: null,
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-10-30",
  },
  {
    id: "j-4",
    judul: "Tips Menjaga Pola Tidur",
    slug: "tips-menjaga-pola-tidur",
    kategoriId: "k-umum",
    penulis: "dr. Andi Pratama",
    ringkasan: "Bangun rutinitas istirahat yang lebih teratur setiap hari.",
    isi: "Tidur yang cukup membantu tubuh memperbaiki sel dan menjaga daya tahan tubuh. Usahakan tidur dan bangun di jam yang sama setiap hari, hindari kafein sore hari, dan jauhkan gawai minimal 30 menit sebelum tidur.",
    berkas: null,
    menitBaca: 3,
    status: "terbit",
    tanggalTerbit: "2026-10-29",
  },
  {
    id: "j-5",
    judul: "Aktif Bergerak Setiap Hari",
    slug: "aktif-bergerak-setiap-hari",
    kategoriId: "k-umum",
    penulis: "Tim Promkes Puskesmas",
    ringkasan: "Mulai aktivitas fisik ringan di sela kesibukan Anda.",
    isi: "WHO menganjurkan aktivitas fisik intensitas sedang minimal 150 menit per minggu. Anda bisa memulainya dengan berjalan kaki 30 menit sehari, naik tangga, atau peregangan setiap satu jam duduk.",
    berkas: null,
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-10-28",
  },
  {
    id: "j-6",
    judul: "Pentingnya Cukup Minum",
    slug: "pentingnya-cukup-minum",
    kategoriId: "k-gizi",
    penulis: "Ahli Gizi Puskesmas",
    ringkasan: "Kenali kebutuhan cairan dan kebiasaan minum yang baik.",
    isi: "Kekurangan cairan dapat menyebabkan lemas, sakit kepala, dan sulit berkonsentrasi. Perhatikan warna urine: kuning jernih menandakan tubuh cukup cairan. Jangan menunggu haus untuk minum.",
    berkas: null,
    menitBaca: 3,
    status: "terbit",
    tanggalTerbit: "2026-10-27",
  },
];

/** Jadwal dokter. `tanggal` null = jadwal berulang setiap `hari` (PRD KD-4). */
function buildJadwalDokter() {
  const list = [];
  let n = 1;
  const push = (data) => list.push({ id: `jd-${n++}`, tanggal: null, ...data });

  const andi = {
    dokterNama: "dr. Andi Pratama",
    spesialisasi: "Dokter Umum",
    lokasi: "Poli Umum — Ruang 01",
  };
  ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].forEach((hari) =>
    push({ ...andi, hari, jamMulai: "09:00", jamSelesai: "12:00", kuota: 20, status: "aktif" })
  );
  push({ ...andi, hari: "Sabtu", jamMulai: "08:00", jamSelesai: "11:00", kuota: 15, status: "penuh" });

  const siti = {
    dokterNama: "dr. Siti Rahma, Sp.KK",
    spesialisasi: "Spesialis Kulit",
    lokasi: "Poli Kulit — Ruang 03",
  };
  ["Senin", "Rabu", "Kamis"].forEach((hari) =>
    push({ ...siti, hari, jamMulai: "13:00", jamSelesai: "15:00", kuota: 10, status: "aktif" })
  );
  push({ ...siti, hari: "Jumat", jamMulai: "13:00", jamSelesai: "15:00", kuota: 10, status: "dibatalkan" });

  const maya = {
    dokterNama: "drg. Maya Lestari",
    spesialisasi: "Dokter Gigi",
    lokasi: "Poli Gigi — Ruang 02",
  };
  ["Selasa", "Kamis"].forEach((hari) =>
    push({ ...maya, hari, jamMulai: "08:00", jamSelesai: "11:30", kuota: 12, status: "aktif" })
  );

  return list;
}

function buildKegiatan() {
  const rincianJam =
    "Jam Pelayanan:\n• LANSIA: 08.00 – 09.30 WIB\n• BALITA: 09.30 – 11.00 WIB\n• BUMIL / Apras / Remaja / Usia Produktif: 11.00 – 12.00 WIB";

  return [
    {
      id: "kg-1",
      nama: "Kelas BUMIL & Kelas BALITA",
      jenis: "penyuluhan",
      penyelenggara: "Rini Kurniani, Amd.Keb & Yeni Anggraini, Amd.Keb",
      tanggal: "2026-11-05",
      waktuMulai: "08:00",
      waktuSelesai: "12:00",
      lokasi: "Perum Polda",
      kuota: 50,
      deskripsi: `Kegiatan edukasi, pemeriksaan, dan pendampingan Kelas Ibu Hamil (BUMIL) serta Kelas Balita.\n\n${rincianJam}`,
    },
    {
      id: "kg-2",
      nama: "POSY. KARTIKA",
      jenis: "pemeriksaan",
      penyelenggara: "Rini Kurniani, Amd.Keb",
      tanggal: "2026-11-11",
      waktuMulai: "08:00",
      waktuSelesai: "12:00",
      lokasi: "Posyandu Kartika",
      kuota: 60,
      deskripsi: `Pelayanan kesehatan terpadu masyarakat di Posyandu Kartika.\n\n${rincianJam}`,
    },
    {
      id: "kg-3",
      nama: "POSYANDU CUT MUTYA",
      jenis: "pemeriksaan",
      penyelenggara: "Rini Kurniani, Amd.Keb",
      tanggal: "2026-11-12",
      waktuMulai: "08:00",
      waktuSelesai: "12:00",
      lokasi: "Posyandu Cut Mutya",
      kuota: 60,
      deskripsi: `Pelayanan kesehatan terpadu masyarakat di Posyandu Cut Mutya.\n\n${rincianJam}`,
    },
    {
      id: "kg-4",
      nama: "POSY. ILP DAHLIA",
      jenis: "pemeriksaan",
      penyelenggara: "Rini Kurniani, Amd.Keb",
      tanggal: "2026-11-13",
      waktuMulai: "08:00",
      waktuSelesai: "12:00",
      lokasi: "Posyandu ILP Dahlia",
      kuota: 60,
      deskripsi: `Pelayanan kesehatan Integrasi Layanan Primer (ILP) di Posyandu Dahlia.\n\n${rincianJam}`,
    },
    {
      id: "kg-5",
      nama: "POSBINDU KARTIKA",
      jenis: "pemeriksaan",
      penyelenggara: "Rini Kurniani, Amd.Keb",
      tanggal: "2026-11-16",
      waktuMulai: "08:00",
      waktuSelesai: "12:00",
      lokasi: "Posbindu Kartika",
      kuota: 60,
      deskripsi: `Pelayanan Pos Pembinaan Terpadu (Posbindu) Kartika.\n\n${rincianJam}`,
    },
  ];
}

const pengaturan = {
  namaFaskes: "Puskesmas Banjar Agung",
  jamPelayanan: "08.00 – 12.00",
  hariPelayanan: "Lansia, Balita & Bumil/Usia Produktif",
  kontakTelepon: "(0721) 123-456",
  kontakWhatsapp: "6281234567890",
  sebelumBerkunjung:
    "Jam Pelayanan:\n• LANSIA: 08.00 – 09.30 WIB\n• BALITA: 09.30 – 11.00 WIB\n• BUMIL / Apras / Remaja / Usia Produktif: 11.00 – 12.00 WIB\n\nSiapkan KTP atau kartu BPJS serta buku KIA/dokumen pemeriksaan sebelumnya.",
};

export function createSeed() {
  const today = todayISO();
  return {
    version: 1,
    users,
    kategori,
    jurnal,
    jadwalDokter: buildJadwalDokter(),
    kegiatan: buildKegiatan(today),
    pengaturan,
  };
}


/**
 * Data awal sesuai 3 kategori utama Jurnal Kesehatan (Lansia, Ibu Hamil, Balita)
 * serta Jadwal Kegiatan Posyandu Banjar Agung dilengkapi link Google Maps.
 */
import { todayISO } from "@/lib/date";

export const DEMO_ACCOUNTS = [
  { email: "user@email.com", password: "user123", label: "Pengguna" },
  { email: "admin@posyandu.id", password: "admin123", label: "Administrator" },
];

const users = [
  {
    id: "u-1",
    nama: "User",
    email: "user@email.com",
    password: "user123",
    peran: "pengguna",
  },
  {
    id: "u-2",
    nama: "Petugas Posyandu",
    email: "admin@posyandu.id",
    password: "admin123",
    peran: "admin",
  },
];

export const DEFAULT_KATEGORI = [
  { id: "k-lansia", nama: "Lansia", slug: "lansia" },
  { id: "k-bumil", nama: "Ibu Hamil (Bumil)", slug: "ibu-hamil" },
  { id: "k-balita", nama: "Balita", slug: "balita" },
];

export const KATEGORI_ILLUSTRATION = {
  "k-lansia": "/illustrations/lansia.svg",
  "k-bumil": "/illustrations/bumil.svg",
  "k-balita": "/illustrations/balita.svg",
};

const jurnal = [
  {
    id: "j-1",
    judul: "Panduan Menjaga Tekanan Darah dan Jantung Sehat di Usia Lansia",
    slug: "panduan-menjaga-tekanan-darah-dan-jantung-sehat-di-usia-lansia",
    kategoriId: "k-lansia",
    penulis: "Rini Kurniani, Amd.Keb",
    ringkasan:
      "Langkah praktis menjaga tensi tetap stabil melalui pola makan rendah garam, senam lansia, dan pemeriksaan rutin di Posbindu.",
    isi: "Memasuki usia lanjut, elastisitas pembuluh darah secara alami berkurang sehingga risiko hipertensi meningkat. Namun, kondisi ini dapat dikendalikan dengan pola hidup yang tepat.\n\n1. Batasi konsumsi garam maksimal 1 sendok teh per hari dan kurangi makanan berlemak tinggi.\n2. Lakukan aktivitas fisik ringan seperti jalan pagi atau senam lansia selama 20–30 menit.\n3. Perbanyak konsumsi sayur hijau, buah segar, dan air putih.\n4. Rutin memeriksa tekanan darah, gula darah, dan kolesterol setiap bulan di Posbindu/Posyandu Lansia Desa Banjar Agung.",
    berkas: {
      name: "ilustrasi-kesehatan-lansia.svg",
      type: "image/svg+xml",
      size: 2450,
      dataUrl: "/illustrations/lansia.svg",
    },
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-11-15",
  },
  {
    id: "j-2",
    judul: "Aktivitas Fisik & Senam Ringan untuk Menjaga Kebugaran Lansia",
    slug: "aktivitas-fisik-dan-senam-ringan-untuk-menjaga-kebugaran-lansia",
    kategoriId: "k-lansia",
    penulis: "Tim Posbindu Banjar Agung",
    ringkasan:
      "Gerakan peregangan dan jalan santai yang aman untuk menjaga kekuatan otot, keseimbangan tubuh, serta kualitas tidur lansia.",
    isi: "Tetap aktif bergerak di usia lanjut sangat bermanfaat untuk mencegah nyeri sendi, menjaga daya ingat, dan meningkatkan suasana hati.\n\nLansia disarankan melakukan gerakan peregangan ringan setiap pagi, berjalan santai di sekitar halaman rumah, serta mengikuti kegiatan senam bersama di Posyandu Banjar Agung. Pastikan selalu melakukan pemanasan dan minum air putih yang cukup.",
    berkas: {
      name: "senam-kebugaran-lansia.svg",
      type: "image/svg+xml",
      size: 2450,
      dataUrl: "/illustrations/lansia.svg",
    },
    menitBaca: 3,
    status: "terbit",
    tanggalTerbit: "2026-11-10",
  },
  {
    id: "j-3",
    judul: "Kebutuhan Gizi, Asam Folat & Tablet Tambah Darah untuk Ibu Hamil",
    slug: "kebutuhan-gizi-asam-folat-dan-tablet-tambah-darah-untuk-ibu-hamil",
    kategoriId: "k-bumil",
    penulis: "Rini Kurniani, Amd.Keb & Yeni Anggraini, Amd.Keb",
    ringkasan:
      "Pentingnya memenuhi nutrisi makro dan mikro sejak trimester pertama untuk mencegah anemia pada ibu dan mendukung perkembangan janin.",
    isi: "Selama masa kehamilan, kebutuhan nutrisi ibu meningkat untuk mendukung tumbuh kembang janin di dalam kandungan.\n\n1. Konsumsi Tablet Tambah Darah (TTD) minimal 90 tablet selama kehamilan untuk mencegah anemia.\n2. Penuhi asupan protein hewani (ikan, telur, ayam, daging) dan nabati (tempe, tahu, kacang-kacangan).\n3. Perbanyak makanan tinggi asam folat dan kalsium.\n4. Ikuti Kelas Ibu Hamil (Bumil) di Posyandu Banjar Agung secara rutin untuk memantau berat badan, tekanan darah, dan detak jantung janin.",
    berkas: {
      name: "ilustrasi-ibu-hamil.svg",
      type: "image/svg+xml",
      size: 2680,
      dataUrl: "/illustrations/bumil.svg",
    },
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-11-14",
  },
  {
    id: "j-4",
    judul: "Mengenal Tanda Bahaya Kehamilan dan Persiapan Persalinan Aman",
    slug: "mengenal-tanda-bahaya-kehamilan-dan-persiapan-persalinan-aman",
    kategoriId: "k-bumil",
    penulis: "Yeni Anggraini, Amd.Keb",
    ringkasan:
      "Panduan bagi ibu hamil dan keluarga untuk mengenali gejala yang memerlukan pemeriksaan segera serta daftar persiapan menjelang persalinan.",
    isi: "Setiap ibu hamil dan suami perlu memahami buku KIA (Kesehatan Ibu dan Anak) serta mengenali tanda bahaya kehamilan sejak dini.\n\nWaspadai gejala seperti pusing hebat disertai pandangan kabur, bengkak pada wajah dan tangan, perdarahan, atau gerakan janin yang berkurang. Segera hubungi bidan desa atau kunjungi layanan kesehatan terdekat bila mengalami keluhan tersebut.",
    berkas: {
      name: "persiapan-persalinan-bumil.svg",
      type: "image/svg+xml",
      size: 2680,
      dataUrl: "/illustrations/bumil.svg",
    },
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-11-08",
  },
  {
    id: "j-5",
    judul: "Panduan MPASI Bergizi Seimbang untuk Mencegah Stunting pada Balita",
    slug: "panduan-mpasi-bergizi-seimbang-untuk-mencegah-stunting-pada-balita",
    kategoriId: "k-balita",
    penulis: "Rini Kurniani, Amd.Keb",
    ringkasan:
      "Komposisi Makanan Pendamping ASI kaya protein hewani untuk mendukung pertumbuhan tinggi dan berat badan optimal anak usia 6–24 bulan.",
    isi: "Seribu Hari Pertama Kehidupan (1000 HPK) adalah periode emas tumbuh kembang anak. Setelah usia 6 bulan, ASI perlu didampingi dengan MPASI yang adekuat.\n\n1. Pastikan setiap porsi MPASI mengandung karbohidrat, protein hewani (telur, ikan, hati ayam, daging), lemak sehat, serta sayur/buah.\n2. Sesuaikan tekstur makanan dengan tahapan usia balita.\n3. Timbang berat badan dan ukur tinggi badan balita setiap bulan di Posyandu Banjar Agung agar grafik KMS selalu terpantau.",
    berkas: {
      name: "ilustrasi-kesehatan-balita.svg",
      type: "image/svg+xml",
      size: 2510,
      dataUrl: "/illustrations/balita.svg",
    },
    menitBaca: 4,
    status: "terbit",
    tanggalTerbit: "2026-11-16",
  },
  {
    id: "j-6",
    judul: "Pentingnya Imunisasi Dasar Lengkap dan Pemantauan Tumbuh Kembang Balita",
    slug: "pentingnya-imunisasi-dasar-lengkap-dan-pemantauan-tumbuh-kembang-balita",
    kategoriId: "k-balita",
    penulis: "Tim Posyandu Banjar Agung",
    ringkasan:
      "Jadwal imunisasi rutin dan penimbangan bulanan di Posyandu untuk melindungi buah hati dari penyakit menular berbahaya.",
    isi: "Imunisasi dasar lengkap membentuk kekebalan tubuh balita terhadap berbagai penyakit seperti hepatitis, polio, campak, dan difteri.\n\nSelain imunisasi, pemberian Vitamin A setiap bulan Februari dan Agustus serta penimbangan rutin di Posyandu membantu mendeteksi gangguan pertumbuhan sejak dini.",
    berkas: {
      name: "imunisasi-tumbuh-kembang-balita.svg",
      type: "image/svg+xml",
      size: 2510,
      dataUrl: "/illustrations/balita.svg",
    },
    menitBaca: 3,
    status: "terbit",
    tanggalTerbit: "2026-11-06",
  },
];

function buildJadwalDokter() {
  return [
    {
      id: "jd-kg-1",
      dokterNama: "Rini Kurniani, Amd.Keb & Yeni Anggraini, Amd.Keb",
      spesialisasi: "Kelas BUMIL & Kelas BALITA",
      hari: "Kamis",
      tanggal: "2026-11-05",
      jamMulai: "08:00",
      jamSelesai: "12:00",
      lokasi:
        "Kelas BUMIL & BALITA — Perum Polda (Lansia 08.00-09.30, Balita 09.30-11.00, Bumil/Usia Produktif 11.00-12.00)",
      kuota: 50,
      status: "aktif",
    },
    {
      id: "jd-kg-2",
      dokterNama: "Rini Kurniani, Amd.Keb",
      spesialisasi: "POSY. KARTIKA",
      hari: "Rabu",
      tanggal: "2026-11-11",
      jamMulai: "08:00",
      jamSelesai: "12:00",
      lokasi:
        "POSY. KARTIKA (Lansia 08.00-09.30, Balita 09.30-11.00, Bumil/Usia Produktif 11.00-12.00)",
      kuota: 60,
      status: "aktif",
    },
    {
      id: "jd-kg-3",
      dokterNama: "Rini Kurniani, Amd.Keb",
      spesialisasi: "POSYANDU CUT MUTYA",
      hari: "Kamis",
      tanggal: "2026-11-12",
      jamMulai: "08:00",
      jamSelesai: "12:00",
      lokasi:
        "POSYANDU CUT MUTYA (Lansia 08.00-09.30, Balita 09.30-11.00, Bumil/Usia Produktif 11.00-12.00)",
      kuota: 60,
      status: "aktif",
    },
    {
      id: "jd-kg-4",
      dokterNama: "Rini Kurniani, Amd.Keb",
      spesialisasi: "POSY. ILP DAHLIA",
      hari: "Jumat",
      tanggal: "2026-11-13",
      jamMulai: "08:00",
      jamSelesai: "12:00",
      lokasi:
        "POSY. ILP DAHLIA (Lansia 08.00-09.30, Balita 09.30-11.00, Bumil/Usia Produktif 11.00-12.00)",
      kuota: 60,
      status: "aktif",
    },
    {
      id: "jd-kg-5",
      dokterNama: "Rini Kurniani, Amd.Keb",
      spesialisasi: "POSBINDU KARTIKA",
      hari: "Senin",
      tanggal: "2026-11-16",
      jamMulai: "08:00",
      jamSelesai: "12:00",
      lokasi:
        "POSBINDU KARTIKA (Lansia 08.00-09.30, Balita 09.30-11.00, Bumil/Usia Produktif 11.00-12.00)",
      kuota: 60,
      status: "aktif",
    },
  ];
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
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Perum+Polda+Banjar+Agung",
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
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Posyandu+Kartika+Banjar+Agung",
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
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Posyandu+Cut+Mutya+Banjar+Agung",
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
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Posyandu+Dahlia+Banjar+Agung",
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
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Posbindu+Kartika+Banjar+Agung",
      kuota: 60,
      deskripsi: `Pelayanan Pos Pembinaan Terpadu (Posbindu) Kartika.\n\n${rincianJam}`,
    },
  ];
}

const pengaturan = {
  namaFaskes: "Posyandu Banjar Agung",
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
    version: 2,
    users,
    kategori: DEFAULT_KATEGORI,
    jurnal,
    jadwalDokter: buildJadwalDokter(),
    kegiatan: buildKegiatan(today),
    pengaturan,
  };
}

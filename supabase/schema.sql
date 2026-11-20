-- ============================================================================
-- SKEMA DATABASE POSTGRESQL (SUPABASE)
-- Portal Kesehatan Posyandu Banjar Agung ("Jurnal & Jadwal Dokter")
-- Sesuai PRD Bagian 7 (Model Data)
-- ============================================================================

-- 1. Tabel USER (Profil & Peran Pengguna)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  peran TEXT NOT NULL CHECK (peran IN ('pengguna', 'admin')) DEFAULT 'pengguna',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabel KATEGORI (Kategori Jurnal Kesehatan)
CREATE TABLE IF NOT EXISTS public.kategori (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 3. Tabel JURNAL (Artikel & Berkas Jurnal Kesehatan)
CREATE TABLE IF NOT EXISTS public.jurnal (
  id TEXT PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  kategori_id TEXT REFERENCES public.kategori(id) ON DELETE RESTRICT,
  penulis TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  isi TEXT,
  berkas JSONB,
  menit_baca INT NOT NULL DEFAULT 3,
  status TEXT NOT NULL CHECK (status IN ('draft', 'terbit')) DEFAULT 'draft',
  tanggal_terbit DATE,
  dibuat_oleh TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabel DOKTER (Data Master Dokter)
CREATE TABLE IF NOT EXISTS public.dokter (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  spesialisasi TEXT NOT NULL,
  poli TEXT NOT NULL
);

-- 5. Tabel JADWAL_DOKTER (Jadwal Praktik Mingguan / Tanggal Spesifik)
CREATE TABLE IF NOT EXISTS public.jadwal_dokter (
  id TEXT PRIMARY KEY,
  dokter_id TEXT REFERENCES public.dokter(id) ON DELETE SET NULL,
  dokter_nama TEXT NOT NULL,
  spesialisasi TEXT NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE,
  jam_mulai TEXT NOT NULL,
  jam_selesai TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kuota INT NOT NULL DEFAULT 15,
  status TEXT NOT NULL CHECK (status IN ('aktif', 'penuh', 'dibatalkan', 'tidak_aktif')) DEFAULT 'aktif'
);

-- 6. Tabel KEGIATAN (Jadwal Kegiatan Posyandu)
CREATE TABLE IF NOT EXISTS public.kegiatan (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN ('seminar', 'pemeriksaan', 'penyuluhan')),
  penyelenggara TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu_mulai TEXT NOT NULL,
  waktu_selesai TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kuota INT NOT NULL DEFAULT 50,
  deskripsi TEXT NOT NULL
);

-- 7. Tabel PENGATURAN (Konfigurasi Portal Key-Value)
CREATE TABLE IF NOT EXISTS public.pengaturan (
  kunci TEXT PRIMARY KEY,
  nilai TEXT NOT NULL
);

-- ============================================================================
-- DATA AWAL (SEED DATA SESUAI FIGMA & PRD)
-- ============================================================================

INSERT INTO public.users (id, nama, email, password_hash, peran) VALUES
  ('u-1', 'User', 'user@email.com', 'user123', 'pengguna'),
  ('u-2', 'Petugas Posyandu', 'admin@posyandu.id', 'admin123', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.kategori (id, nama, slug) VALUES
  ('k-umum', 'Kesehatan umum', 'kesehatan-umum'),
  ('k-mental', 'Kesehatan mental', 'kesehatan-mental'),
  ('k-gizi', 'Gizi', 'gizi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jurnal (id, judul, slug, kategori_id, penulis, ringkasan, isi, menit_baca, status, tanggal_terbit, dibuat_oleh) VALUES
  ('j-1', 'Pola Hidup Sehat', 'pola-hidup-sehat', 'k-umum', 'dr. Andi Pratama', '5 kebiasaan sederhana untuk menjaga tubuh tetap bugar.', 'Menjaga kesehatan tidak harus rumit. Mulailah dari lima kebiasaan sederhana berikut: sarapan bergizi, minum 8 gelas air, aktif bergerak 30 menit, tidur 7-8 jam, dan cek kesehatan berkala di puskesmas.', 4, 'terbit', '2026-11-02', 'u-2'),
  ('j-2', 'Menjaga Kesehatan Mental', 'menjaga-kesehatan-mental', 'k-mental', 'Tim Promkes Puskesmas', 'Kenali pentingnya istirahat dan mengelola stres.', 'Kesehatan mental sama pentingnya dengan kesehatan fisik. Luangkan waktu istirahat, latihan napas dalam, dan batasi gawai sebelum tidur.', 5, 'terbit', '2026-11-01', 'u-2'),
  ('j-3', 'Nutrisi Seimbang', 'nutrisi-seimbang', 'k-gizi', 'Ahli Gizi Puskesmas', 'Panduan sederhana memenuhi kebutuhan nutrisi harian.', 'Gunakan pedoman Isi Piringku untuk setiap kali makan: setengah piring sayur dan buah, seperempat makanan pokok, dan seperempat lauk pauk.', 4, 'terbit', '2026-10-30', 'u-2'),
  ('j-4', 'Tips Menjaga Pola Tidur', 'tips-menjaga-pola-tidur', 'k-umum', 'dr. Andi Pratama', 'Bangun rutinitas istirahat yang lebih teratur setiap hari.', 'Tidur yang cukup membantu tubuh memperbaiki sel dan menjaga daya tahan tubuh.', 3, 'terbit', '2026-10-29', 'u-2'),
  ('j-5', 'Aktif Bergerak Setiap Hari', 'aktif-bergerak-setiap-hari', 'k-umum', 'Tim Promkes Puskesmas', 'Mulai aktivitas fisik ringan di sela kesibukan Anda.', 'WHO menganjurkan aktivitas fisik intensitas sedang minimal 150 menit per minggu.', 4, 'terbit', '2026-10-28', 'u-2'),
  ('j-6', 'Pentingnya Cukup Minum', 'pentingnya-cukup-minum', 'k-gizi', 'Ahli Gizi Puskesmas', 'Kenali kebutuhan cairan dan kebiasaan minum yang baik.', 'Kekurangan cairan dapat menyebabkan lemas, sakit kepala, dan sulit berkonsentrasi.', 3, 'terbit', '2026-10-27', 'u-2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dokter (id, nama, spesialisasi, poli) VALUES
  ('d-1', 'dr. Andi Pratama', 'Dokter Umum', 'Poli Umum'),
  ('d-2', 'dr. Siti Rahma, Sp.KK', 'Spesialis Kulit', 'Poli Kulit'),
  ('d-3', 'drg. Maya Lestari', 'Dokter Gigi', 'Poli Gigi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jadwal_dokter (id, dokter_id, dokter_nama, spesialisasi, hari, tanggal, jam_mulai, jam_selesai, lokasi, kuota, status) VALUES
  ('jd-1', 'd-1', 'dr. Andi Pratama', 'Dokter Umum', 'Senin', NULL, '09:00', '12:00', 'Poli Umum — Ruang 01', 20, 'aktif'),
  ('jd-2', 'd-1', 'dr. Andi Pratama', 'Dokter Umum', 'Selasa', NULL, '09:00', '12:00', 'Poli Umum — Ruang 01', 20, 'aktif'),
  ('jd-3', 'd-1', 'dr. Andi Pratama', 'Dokter Umum', 'Rabu', NULL, '09:00', '12:00', 'Poli Umum — Ruang 01', 20, 'aktif'),
  ('jd-4', 'd-1', 'dr. Andi Pratama', 'Dokter Umum', 'Kamis', NULL, '09:00', '12:00', 'Poli Umum — Ruang 01', 20, 'aktif'),
  ('jd-5', 'd-1', 'dr. Andi Pratama', 'Dokter Umum', 'Jumat', NULL, '09:00', '12:00', 'Poli Umum — Ruang 01', 20, 'aktif'),
  ('jd-6', 'd-2', 'dr. Siti Rahma, Sp.KK', 'Spesialis Kulit', 'Senin', NULL, '13:00', '15:00', 'Poli Kulit — Ruang 03', 10, 'aktif'),
  ('jd-7', 'd-2', 'dr. Siti Rahma, Sp.KK', 'Spesialis Kulit', 'Rabu', NULL, '13:00', '15:00', 'Poli Kulit — Ruang 03', 10, 'aktif'),
  ('jd-8', 'd-2', 'dr. Siti Rahma, Sp.KK', 'Spesialis Kulit', 'Kamis', NULL, '13:00', '15:00', 'Poli Kulit — Ruang 03', 10, 'aktif'),
  ('jd-9', 'd-3', 'drg. Maya Lestari', 'Dokter Gigi', 'Selasa', NULL, '08:00', '11:30', 'Poli Gigi — Ruang 02', 12, 'aktif'),
  ('jd-10', 'd-3', 'drg. Maya Lestari', 'Dokter Gigi', 'Kamis', NULL, '08:00', '11:30', 'Poli Gigi — Ruang 02', 12, 'aktif')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pengaturan (kunci, nilai) VALUES
  ('namaFaskes', 'Posyandu Banjar Agung'),
  ('jamPelayanan', '08.00 – 15.00'),
  ('hariPelayanan', 'Senin – Jumat'),
  ('kontakTelepon', '(0721) 123-456'),
  ('kontakWhatsapp', '6281234567890'),
  ('sebelumBerkunjung', e'Siapkan KTP atau kartu BPJS serta dokumen pemeriksaan sebelumnya.\nJadwal dapat berubah. Konfirmasikan kepada petugas sebelum datang.')
ON CONFLICT (kunci) DO NOTHING;

-- ============================================================================
-- STORAGE BUCKET UNTUK BERKAS JURNAL (PDF / DOCX / JPG)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('jurnal-berkas', 'jurnal-berkas', true)
ON CONFLICT (id) DO NOTHING;


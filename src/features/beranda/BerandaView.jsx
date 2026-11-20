"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  BookOpen,
  CalendarClock,
  CalendarX,
  Clock,
  HeartHandshake,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useShell } from "@/components/layout/AppShell";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import JurnalCard from "@/features/jurnal/JurnalCard";
import { useData } from "@/services/dataService";
import { formatTimeRange, greeting, todayISO } from "@/lib/date";
import { STATUS_JADWAL, jadwalPublik, jurnalTerbit, kategoriNama } from "@/lib/selectors";

const PANDUAN_LAYANAN = {
  lansia: {
    title: "Pelayanan Kesehatan Lansia (Posbindu)",
    jam: "08.00 – 09.30 WIB",
    icon: HeartHandshake,
    desc: "Pemeriksaan rutin untuk memantau tekanan darah, gula darah, kolesterol, asam urat, serta senam kebugaran lansia.",
    items: [
      "Membawa KTP atau Kartu BPJS Kesehatan",
      "Pemeriksaan tensi darah & skrining penyakit tidak menular",
      "Konsultasi pola makan rendah garam & senam lansia",
    ],
  },
  bumil: {
    title: "Kelas & Pemeriksaan Ibu Hamil (Bumil)",
    jam: "11.00 – 12.00 WIB",
    icon: Sparkles,
    desc: "Pendampingan kehamilan sehat bersama bidan desa, pemeriksaan kehamilan (ANC), pemberian Tablet Tambah Darah, dan edukasi persalinan.",
    items: [
      "Wajib membawa Buku KIA (Kesehatan Ibu dan Anak)",
      "Pemantauan berat badan, tensi, lingkar lengan, & detak jantung janin",
      "Edukasi gizi kehamilan & persiapan menyusui eksklusif",
    ],
  },
  balita: {
    title: "Posyandu Tumbuh Kembang & Imunisasi Balita",
    jam: "09.30 – 11.00 WIB",
    icon: Baby,
    desc: "Pemantauan pertumbuhan berat & tinggi badan bulanan, imunisasi dasar lengkap, pemberian Vitamin A, serta konsultasi MPASI anti-stunting.",
    items: [
      "Wajib membawa Buku KIA / KMS untuk pencatatan grafik pertumbuhan",
      "Penimbangan berat badan, pengukuran tinggi badan & lingkar kepala",
      "Pemberian Makanan Tambahan (PMT) penyuluhan bergizi",
    ],
  },
};

function SectionTitle({ title, href, linkLabel }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-lg font-bold text-brand-900">{title}</h2>
      <Link
        href={href}
        className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-brand-700 transition-colors hover:text-brand-900"
      >
        {linkLabel}
        <ArrowRight
          size={13}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <Card className="group flex items-center justify-between gap-3 px-4 py-4">
      <div className="flex items-center gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-white group-hover:shadow-md group-hover:shadow-pink-500/25">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-[11px] font-medium text-muted">{label}</p>
          <p className="mt-0.5 text-lg font-extrabold text-brand-900">{value}</p>
        </div>
      </div>
      <p className="text-right text-[10px] font-medium text-muted">{note}</p>
    </Card>
  );
}

/** Frame 02 — Beranda Pengguna Interaktif dengan Animasi Sentuhan & Tab Panduan Layanan. */
export default function BerandaView() {
  const data = useData();
  const { user } = useShell();
  const [activeGuide, setActiveGuide] = useState("balita");
  const [selectedKat, setSelectedKat] = useState("all");

  if (!data) return <Loader />;

  const today = todayISO();
  const semuaJurnal = jurnalTerbit(data.jurnal);
  const pilihan = (
    selectedKat === "all"
      ? semuaJurnal
      : semuaJurnal.filter((j) => j.kategoriId === selectedKat)
  ).slice(0, 3);

  const jadwalHariIni = jadwalPublik(data.jadwalDokter, today);
  const praktik = jadwalHariIni.filter((j) => j.status !== "dibatalkan");
  const poliList = [
    ...new Set(praktik.map((j) => (j.lokasi || "").split(/\s[—–-]\s/)[0])),
  ].filter(Boolean);

  const guide = PANDUAN_LAYANAN[activeGuide];
  const GuideIcon = guide.icon;

  return (
    <>
      <PageHeader
        title={
          <>
            {greeting()}, {user?.nama || "User"}{" "}
            <span aria-hidden className="inline-block animate-bounce">
              👋
            </span>
          </>
        }
        subtitle={`Akses informasi kesehatan dan layanan ${data.pengaturan.namaFaskes}.`}
      />

      {/* Banner Bright Pink Interaktif */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ec4899] via-[#db2777] to-[#9d174d] px-6 py-8 text-white shadow-lg shadow-pink-500/20 sm:px-8">
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute -top-12 -right-10 h-44 w-44 rounded-full bg-white/15 blur-xl"
        />
        <div
          aria-hidden="true"
          className="animate-pulse-soft pointer-events-none absolute right-24 -bottom-14 h-36 w-36 rounded-full bg-pink-300/20 blur-lg"
        />

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold backdrop-blur-xs">
            <Sparkles size={12} /> Layanan Posyandu Terpadu Desa Banjar Agung
          </span>
          <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">
            Jaga kesehatan keluarga, mulai dari hari ini
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-white/90">
            Baca jurnal edukasi Lansia, Ibu Hamil, dan Balita serta pantau jadwal kegiatan
            Posyandu secara langsung.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href="/jadwal-dokter"
              className="h-[42px] bg-white px-4 text-[13px] font-bold text-[#be185d] hover:bg-pink-50"
            >
              Lihat jadwal dokter
            </Button>
            <Button
              href="/jadwal-kegiatan"
              variant="outline"
              className="h-[42px] border-white/40 bg-white/10 px-4 text-[13px] font-semibold text-white backdrop-blur-xs hover:bg-white/20 hover:text-white"
            >
              <CalendarClock size={15} /> Lihat lokasi kegiatan
            </Button>
          </div>
        </div>
      </section>

      {/* 3 Kartu Statistik dengan Ikon Animasi Hover */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Jurnal terbit"
          value={`${semuaJurnal.length} artikel`}
          note="Lansia, Bumil & Balita"
        />
        <StatCard
          icon={Stethoscope}
          label="Praktik hari ini"
          value={`${praktik.length} jadwal`}
          note={poliList.length ? poliList.join(", ") : "Cek jadwal mingguan"}
        />
        <StatCard
          icon={Clock}
          label="Jam pelayanan"
          value={data.pengaturan.jamPelayanan}
          note="Posyandu & Posbindu"
        />
      </div>

      {/* Widget Interaktif: Panduan Sesi Layanan Posyandu (Lansia / Bumil / Balita) */}
      <section className="mt-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-brand-900">
              Panduan Sesi Layanan Posyandu
            </h2>
            <p className="text-xs text-muted">
              Sentuh kategori di bawah untuk melihat jam pelayanan & perlengkapan yang perlu dibawa:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={activeGuide === "lansia"}
              onClick={() => setActiveGuide("lansia")}
            >
              👵 Lansia
            </Chip>
            <Chip
              active={activeGuide === "bumil"}
              onClick={() => setActiveGuide("bumil")}
            >
              🤰 Ibu Hamil
            </Chip>
            <Chip
              active={activeGuide === "balita"}
              onClick={() => setActiveGuide("balita")}
            >
              👶 Balita
            </Chip>
          </div>
        </div>

        <Card
          key={activeGuide}
          className="mt-3.5 border-brand-100 bg-gradient-to-br from-white via-white to-brand-50/60 p-5 sm:p-6"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#db2777] text-white shadow-md shadow-pink-500/25">
                <GuideIcon size={24} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-brand-900">{guide.title}</h3>
                  <Badge>Jam: {guide.jam}</Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{guide.desc}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {guide.items.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 rounded-xl border border-line bg-white/90 p-2.5 text-xs text-brand-900 shadow-2xs"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Jurnal Kesehatan Pilihan dengan Filter Kategori Interaktif */}
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-2 text-lg font-bold text-brand-900">
              Jurnal kesehatan pilihan
            </h2>
            <Chip
              active={selectedKat === "all"}
              onClick={() => setSelectedKat("all")}
            >
              Semua
            </Chip>
            {data.kategori.map((k) => (
              <Chip
                key={k.id}
                active={selectedKat === k.id}
                onClick={() => setSelectedKat(k.id)}
              >
                {k.nama}
              </Chip>
            ))}
          </div>
          <Link
            href="/jurnal"
            className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
          >
            Lihat semua jurnal
            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {pilihan.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pilihan.map((j) => (
              <JurnalCard
                key={j.id}
                jurnal={j}
                kategori={kategoriNama(data.kategori, j.kategoriId)}
                showMeta={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada jurnal pada kategori ini"
            description="Jurnal kesehatan akan tampil di sini setelah dipublikasikan petugas."
          />
        )}
      </section>

      {/* Jadwal dokter hari ini */}
      <section className="mt-8">
        <SectionTitle
          title="Jadwal dokter & layanan hari ini"
          href="/jadwal-dokter"
          linkLabel="Lihat jadwal lengkap"
        />
        {jadwalHariIni.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {jadwalHariIni.map((j) => {
              const st = STATUS_JADWAL[j.status];
              return (
                <Card
                  key={j.id}
                  className="flex items-start justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="text-[13px] font-bold text-brand-900">{j.dokterNama}</p>
                    <p className="mt-2 text-xs text-muted">{j.lokasi}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-700">
                      {formatTimeRange(j.jamMulai, j.jamSelesai)}
                    </p>
                  </div>
                  <Badge tone={st.tone} className="min-w-[94px] justify-center">
                    {st.userLabel}
                  </Badge>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CalendarX}
            title="Tidak ada jadwal layanan pada hari ini"
            description="Silakan cek jadwal tanggal lainnya pada halaman Jadwal Dokter atau Jadwal Kegiatan."
            action={
              <div className="flex flex-wrap justify-center gap-2.5">
                <Button href="/jadwal-dokter" variant="outline" size="sm">
                  Lihat jadwal dokter
                </Button>
                <Button href="/jadwal-kegiatan" size="sm">
                  Lihat jadwal kegiatan
                </Button>
              </div>
            }
          />
        )}
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import { useData } from "@/services/dataService";
import { dayName, formatDayMonth, formatLong, formatShort, formatTimeRange, todayISO } from "@/lib/date";
import { STATUS_JADWAL, daftarDokter, jadwalPadaTanggal, kategoriNama } from "@/lib/selectors";

/** Frame 05 — Dashboard Admin (PRD ADM-1 s/d ADM-5). */
export default function AdminDashboardView() {
  const data = useData();
  if (!data) return <Loader />;

  const today = todayISO();
  const terbitList = data.jurnal.filter((j) => j.status === "terbit");
  const draftList = data.jurnal.filter((j) => j.status === "draft");
  const dokterList = daftarDokter(data.jadwalDokter, data.dokter);
  const jadwalHariIni = jadwalPadaTanggal(data.jadwalDokter, today).filter(
    (j) => j.status !== "tidak_aktif"
  );

  const poliNote = [...new Set(data.jadwalDokter.map((j) => j.lokasi.split(/\s[—–-]\s/)[0]))]
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
  const terbaru = [...data.jurnal]
    .sort((a, b) => (b.tanggalTerbit || "0").localeCompare(a.tanggalTerbit || "0"))
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title="Dashboard Admin"
        subtitle="Kelola jurnal kesehatan dan jadwal dokter dalam satu tempat."
      />

      {/* 4 Kartu Statistik (ADM-1) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-[11px] text-muted">Jurnal terbit</p>
          <p className="mt-2 text-2xl font-bold text-brand-900">{terbitList.length}</p>
          <p className="mt-2 text-[10px] text-muted">Tersedia untuk pengguna</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-muted">Draft jurnal</p>
          <p className="mt-2 text-2xl font-bold text-brand-900">{draftList.length}</p>
          <p className="mt-2 text-[10px] text-muted">Belum dipublikasikan</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-muted">Dokter terdaftar</p>
          <p className="mt-2 text-2xl font-bold text-brand-900">{dokterList.length}</p>
          <p className="mt-2 truncate text-[10px] text-muted">
            {poliNote || "Tersedia di puskesmas"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-muted">Jadwal hari ini</p>
          <p className="mt-2 text-2xl font-bold text-brand-900">{jadwalHariIni.length}</p>
          <p className="mt-2 text-[10px] text-muted">
            {dayName(today)}, {formatDayMonth(today)}
          </p>
        </Card>
      </div>

      {/* Kartu Aksi Cepat (ADM-2) */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl bg-brand-900 p-6 text-white">
          <div>
            <h2 className="text-base font-bold">Publikasikan informasi kesehatan</h2>
            <p className="mt-1.5 text-xs text-white/80">
              Tambahkan artikel dan berkas jurnal untuk pengguna.
            </p>
          </div>
          <Link
            href="/admin/jurnal/tambah"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
          >
            <Plus size={14} /> Tambah jurnal kesehatan
          </Link>
        </div>

        <Card className="flex flex-col justify-between p-6">
          <div>
            <h2 className="text-base font-bold text-brand-900">Atur layanan dokter & kegiatan</h2>
            <p className="mt-1.5 text-xs text-muted">
              Tentukan dokter, waktu praktik, lokasi, kuota pasien, serta agenda kegiatan.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
              href="/admin/jadwal-dokter/tambah"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:text-brand-700 hover:underline"
            >
              <Plus size={14} /> Tambah jadwal dokter
            </Link>
            <Link
              href="/admin/kegiatan/tambah"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
            >
              <Plus size={14} /> Tambah jadwal kegiatan
            </Link>
          </div>
        </Card>
      </div>

      {/* Panel Bawah: Jurnal Terbaru & Jadwal Hari Ini (ADM-3, ADM-4) */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Card className="flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-base font-bold text-brand-900">Jurnal kesehatan terbaru</h2>
              <Link
                href="/admin/jurnal"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-900 hover:text-brand-700"
              >
                Kelola jurnal <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-[1.6fr_1fr_90px] bg-brand-50 px-5 py-2.5 text-[11px] font-semibold text-brand-900">
              <span>Judul jurnal</span>
              <span>Tanggal terbit</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-line">
              {terbaru.map((j) => (
                <div
                  key={j.id}
                  className="grid grid-cols-[1.6fr_1fr_90px] items-center gap-2 px-5 py-3.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-brand-900">{j.judul}</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {kategoriNama(data.kategori, j.kategoriId)}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted">
                    {j.tanggalTerbit ? formatShort(j.tanggalTerbit) : "Belum terbit"}
                  </span>
                  <div>
                    <Badge
                      tone={j.status === "terbit" ? "brand" : "amber"}
                      className="min-w-[68px] justify-center"
                    >
                      {j.status === "terbit" ? "Terbit" : "Draft"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line px-5 py-3 text-[11px] text-muted">
            Menampilkan {terbaru.length} dari {terbitList.length} jurnal terbit
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <div>
            <h2 className="text-base font-bold text-brand-900">Jadwal dokter hari ini</h2>
            <p className="mt-0.5 text-[11px] text-muted">{formatLong(today)}</p>

            <div className="mt-4 divide-y divide-line">
              {jadwalHariIni.length > 0 ? (
                jadwalHariIni.map((j) => {
                  const st = STATUS_JADWAL[j.status] || STATUS_JADWAL.aktif;
                  return (
                    <div key={j.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0">
                      <div>
                        <p className="text-xs font-semibold text-brand-900">{j.dokterNama}</p>
                        <p className="mt-1 text-[11px] text-muted">{j.lokasi}</p>
                        <p className="mt-1 text-[11px] font-semibold text-brand-900">
                          {formatTimeRange(j.jamMulai, j.jamSelesai)}
                        </p>
                      </div>
                      <Badge tone={st.tone} className="min-w-[74px] justify-center">
                        {st.label}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="py-6 text-xs text-muted">Tidak ada jadwal dokter aktif hari ini.</p>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <Link
              href="/admin/jadwal-dokter"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:text-brand-700"
            >
              Kelola jadwal dokter <ArrowRight size={12} />
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}


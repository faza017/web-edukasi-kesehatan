"use client";

import Link from "next/link";
import { ArrowRight, CalendarX } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useShell } from "@/components/layout/AppShell";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import JurnalCard from "@/features/jurnal/JurnalCard";
import { useData } from "@/services/dataService";
import { formatTimeRange, greeting, todayISO } from "@/lib/date";
import { STATUS_JADWAL, jadwalPublik, jurnalTerbit, kategoriNama } from "@/lib/selectors";

function SectionTitle({ title, href, linkLabel }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-lg font-bold text-brand-900">{title}</h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-900 hover:text-brand-700"
      >
        {linkLabel} <ArrowRight size={12} />
      </Link>
    </div>
  );
}

function StatCard({ label, value, note }) {
  return (
    <Card className="flex items-end justify-between gap-3 px-4 py-4">
      <div>
        <p className="text-[10px] text-muted">{label}</p>
        <p className="mt-2 text-lg font-bold text-brand-900">{value}</p>
      </div>
      <p className="pb-1 text-right text-[10px] text-muted">{note}</p>
    </Card>
  );
}

/** Frame 02 — Beranda Pengguna (PRD HOME-1 s/d HOME-6). */
export default function BerandaView() {
  const data = useData();
  const { user } = useShell();
  if (!data) return <Loader />;

  const today = todayISO();
  const pilihan = jurnalTerbit(data.jurnal).slice(0, 3);
  const jadwalHariIni = jadwalPublik(data.jadwalDokter, today);
  const praktik = jadwalHariIni.filter((j) => j.status !== "dibatalkan");
  const spesialis = [...new Set(praktik.map((j) => j.spesialisasi))];

  return (
    <>
      <PageHeader
        title={
          <>
            {greeting()}, {user?.nama || "User"} <span aria-hidden>👋</span>
          </>
        }
        subtitle={`Akses informasi kesehatan dan layanan ${data.pengaturan.namaFaskes}.`}
      />

      {/* Banner */}
      <section className="rounded-2xl bg-brand-900 px-6 py-7 text-white">
        <h2 className="text-xl font-bold">Jaga kesehatan, mulai dari hari ini</h2>
        <p className="mt-3 text-[13px] text-white/85">
          Baca jurnal kesehatan terbaru dan temukan jadwal dokter yang sesuai.
        </p>
        <Button href="/jadwal-dokter" className="mt-6 h-[42px] px-4 text-[13px]">
          Lihat jadwal dokter
        </Button>
      </section>

      {/* Ringkasan */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Jurnal pilihan" value={`${pilihan.length} artikel`} note="Untuk hidup lebih sehat" />
        <StatCard
          label="Praktik hari ini"
          value={`${praktik.length} dokter`}
          note={spesialis.length ? spesialis.join(", ") : "Tidak ada praktik"}
        />
        <StatCard
          label="Jam pelayanan"
          value={data.pengaturan.jamPelayanan}
          note={data.pengaturan.hariPelayanan}
        />
      </div>

      {/* Jurnal pilihan */}
      <section className="mt-8">
        <SectionTitle title="Jurnal kesehatan pilihan" href="/jurnal" linkLabel="Lihat semua jurnal" />
        {pilihan.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pilihan.map((j) => (
              <JurnalCard key={j.id} jurnal={j} kategori={kategoriNama(data.kategori, j.kategoriId)} showMeta={false} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada jurnal" description="Jurnal kesehatan akan tampil di sini setelah dipublikasikan petugas." />
        )}
      </section>

      {/* Jadwal dokter hari ini */}
      <section className="mt-8">
        <SectionTitle title="Jadwal dokter hari ini" href="/jadwal-dokter" linkLabel="Lihat jadwal lengkap" />
        {jadwalHariIni.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {jadwalHariIni.map((j) => {
              const st = STATUS_JADWAL[j.status];
              return (
                <Card key={j.id} className="flex items-start justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="text-[13px] font-semibold text-brand-900">{j.dokterNama}</p>
                    <p className="mt-3 text-[11px] text-muted">{j.spesialisasi}</p>
                    <p className="mt-2.5 text-[11px] font-medium text-brand-900">
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
            title="Tidak ada dokter praktik hari ini"
            description="Silakan cek jadwal hari lain pada halaman Jadwal Dokter."
            action={
              <Button href="/jadwal-dokter" variant="outline" size="sm">
                Lihat jadwal minggu ini
              </Button>
            }
          />
        )}
      </section>
    </>
  );
}


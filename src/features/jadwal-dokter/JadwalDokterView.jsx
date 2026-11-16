"use client";

import { useState } from "react";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useData } from "@/services/dataService";
import {
  addDays,
  dayName,
  formatLong,
  formatMonthYear,
  formatTimeRange,
  formatWeekRange,
  parseISO,
  startOfWeek,
  todayISO,
} from "@/lib/date";
import {
  STATUS_JADWAL,
  daftarPoli,
  jadwalPublik,
  poliDariLokasi,
  sesiJam,
} from "@/lib/selectors";
import { cn } from "@/lib/utils";

/** Frame 04 — Jadwal Dokter (PRD JDW-1 s/d JDW-8). */
export default function JadwalDokterView() {
  const data = useData();
  const [selectedIso, setSelectedIso] = useState("2026-11-02");
  const [weekStartIso, setWeekStartIso] = useState("2026-11-02");
  const [query, setQuery] = useState("");
  const [poli, setPoli] = useState("all");
  const [sesi, setSesi] = useState("all");
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    const today = todayISO();
    setSelectedIso(today);
    setWeekStartIso(startOfWeek(today));
    setInitialized(true);
  }

  if (!data) return <Loader />;

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartIso, i));
  const poliOptions = daftarPoli(data.jadwalDokter);

  const moveWeek = (delta) => {
    const nextStart = addDays(weekStartIso, delta * 7);
    setWeekStartIso(nextStart);
    setSelectedIso(nextStart);
  };

  const q = query.trim().toLowerCase();
  const rows = jadwalPublik(data.jadwalDokter, selectedIso).filter((j) => {
    const matchName = !q || j.dokterNama.toLowerCase().includes(q);
    const matchPoli = poli === "all" || poliDariLokasi(j.lokasi) === poli;
    const matchSesi = sesi === "all" || sesiJam(j.jamMulai) === sesi;
    return matchName && matchPoli && matchSesi;
  });

  const praktikCount = rows.filter((r) => r.status !== "dibatalkan").length;

  return (
    <>
      <PageHeader
        title="Jadwal Dokter"
        subtitle="Lihat jadwal praktik dan pilih waktu kunjungan yang sesuai."
      />

      {/* Bulan & Navigasi Minggu (JDW-1) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-900">{formatMonthYear(selectedIso)}</h2>
          <p className="mt-1 text-xs text-muted">{formatWeekRange(weekStartIso)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveWeek(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-brand-900 hover:bg-brand-50"
            aria-label="Minggu sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => moveWeek(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-brand-900 hover:bg-brand-50"
            aria-label="Minggu berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Strip 7 Hari (JDW-2) */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((iso) => {
          const active = iso === selectedIso;
          const dateNum = String(parseISO(iso).getUTCDate()).padStart(2, "0");
          return (
            <button
              key={iso}
              type="button"
              onClick={() => setSelectedIso(iso)}
              aria-pressed={active}
              className={cn(
                "flex h-[74px] flex-col items-center justify-center rounded-xl border transition-colors",
                active
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-line bg-white text-brand-900 hover:border-brand-700"
              )}
            >
              <span className={cn("text-[11px]", active ? "text-white/90" : "text-muted")}>
                {dayName(iso)}
              </span>
              <span className="mt-1 text-xl font-bold leading-none">{dateNum}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Cari, Poli, Jam (JDW-3, JDW-4) */}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_200px_190px]">
        <Input
          type="search"
          placeholder="Cari nama dokter..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Cari nama dokter"
        />
        <Select
          value={poli}
          onChange={(e) => setPoli(e.target.value)}
          aria-label="Filter poli"
          className="font-semibold text-brand-900"
        >
          <option value="all">Semua poli</option>
          {poliOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <Select
          value={sesi}
          onChange={(e) => setSesi(e.target.value)}
          aria-label="Filter sesi jam"
          className="font-semibold text-brand-900"
        >
          <option value="all">Semua jam</option>
          <option value="pagi">Pagi (08.00 – 12.00)</option>
          <option value="siang">Siang (12.00 – 15.00)</option>
        </Select>
      </div>

      {/* Subheader Tanggal Terpilih & Jumlah Dokter */}
      <div className="mt-6 mb-3 flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-brand-900">{formatLong(selectedIso)}</h3>
        <span className="text-xs text-muted">{praktikCount} dokter praktik</span>
      </div>

      {/* Tabel Jadwal (JDW-5, JDW-6) */}
      {rows.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.6fr_1.1fr_1.2fr_110px] items-center bg-brand-50 px-5 py-3 text-[11px] font-semibold text-brand-900 md:grid">
            <span>Nama dokter</span>
            <span>Jam praktik</span>
            <span>Lokasi / Poli</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-line">
            {rows.map((j) => {
              const st = STATUS_JADWAL[j.status] || STATUS_JADWAL.aktif;
              return (
                <div
                  key={j.id}
                  className="grid gap-2 px-5 py-4 md:grid-cols-[1.6fr_1.1fr_1.2fr_110px] md:items-center"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-brand-900">{j.dokterNama}</p>
                    <p className="mt-1 text-[10px] text-muted">{data.pengaturan.namaFaskes}</p>
                  </div>
                  <p className="text-xs font-semibold text-brand-900">
                    {formatTimeRange(j.jamMulai, j.jamSelesai)}
                  </p>
                  <p className="text-xs text-muted">{j.lokasi}</p>
                  <div>
                    <Badge tone={st.tone} className="min-w-[94px] justify-center">
                      {st.userLabel}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={CalendarX}
          title="Tidak ada jadwal dokter pada hari ini"
          description="Silakan pilih hari lain pada kalender mingguan atau ubah filter pencarian."
        />
      )}

      {/* Kotak Info Sebelum Berkunjung (JDW-7) */}
      <div className="mt-6 rounded-2xl bg-brand-50 px-5 py-4">
        <p className="text-sm font-bold text-brand-900">Sebelum berkunjung</p>
        <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-muted">
          {data.pengaturan.sebelumBerkunjung}
        </p>
      </div>
    </>
  );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { deleteJadwalDokter, updateJadwalDokter, useData } from "@/services/dataService";
import { HARI_SENIN_DULU, formatShort, formatTimeRange } from "@/lib/date";
import { STATUS_JADWAL, daftarPoli, poliDariLokasi } from "@/lib/selectors";

/** Kelola Jadwal Dokter (Tabel + Filter + Aksi CRUD — PRD KD-1). */
export default function AdminJadwalDokterListView() {
  const data = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [hari, setHari] = useState("all");
  const [poli, setPoli] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!data) return <Loader />;

  const poliOptions = daftarPoli(data.jadwalDokter);
  const q = query.trim().toLowerCase();

  const list = data.jadwalDokter.filter((j) => {
    const matchQ =
      !q ||
      j.dokterNama.toLowerCase().includes(q) ||
      j.spesialisasi.toLowerCase().includes(q);
    const matchHari = hari === "all" || j.hari === hari;
    const matchPoli = poli === "all" || poliDariLokasi(j.lokasi) === poli;
    return matchQ && matchHari && matchPoli;
  });

  const toggleStatus = (item) => {
    const next = item.status === "aktif" ? "tidak_aktif" : "aktif";
    updateJadwalDokter(item.id, { status: next });
    toast(
      next === "aktif"
        ? `Jadwal ${item.dokterNama} (${item.hari}) diaktifkan.`
        : `Jadwal ${item.dokterNama} (${item.hari}) dinonaktifkan.`
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteJadwalDokter(deleteTarget.id);
    toast(`Jadwal ${deleteTarget.dokterNama} berhasil dihapus.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader
        title="Kelola Jadwal Dokter"
        subtitle="Atur jadwal praktik mingguan maupun tanggal khusus untuk setiap dokter."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-brand-900">
          Total {list.length} jadwal ditampilkan
        </p>
        <Button href="/admin/jadwal-dokter/tambah">
          <Plus size={16} /> Tambah jadwal dokter
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_190px]">
        <Input
          type="search"
          placeholder="Cari nama dokter atau spesialisasi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Cari jadwal dokter"
        />
        <Select value={hari} onChange={(e) => setHari(e.target.value)} aria-label="Filter hari">
          <option value="all">Semua hari</option>
          {HARI_SENIN_DULU.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </Select>
        <Select value={poli} onChange={(e) => setPoli(e.target.value)} aria-label="Filter poli">
          <option value="all">Semua poli</option>
          {poliOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </div>

      {list.length > 0 ? (
        <Card className="mt-4 overflow-hidden">
          <div className="hidden grid-cols-[1.5fr_1fr_1.1fr_1.1fr_95px_200px] bg-brand-50 px-5 py-3 text-[11px] font-semibold text-brand-900 md:grid">
            <span>Dokter & Spesialisasi</span>
            <span>Hari / Tanggal</span>
            <span>Jam Praktik</span>
            <span>Lokasi & Kuota</span>
            <span>Status</span>
            <span className="text-right">Aksi</span>
          </div>

          <div className="divide-y divide-line">
            {list.map((j) => {
              const st = STATUS_JADWAL[j.status] || STATUS_JADWAL.aktif;
              return (
                <div
                  key={j.id}
                  className="grid gap-2 px-5 py-4 md:grid-cols-[1.5fr_1fr_1.1fr_1.1fr_95px_200px] md:items-center"
                >
                  <div>
                    <p className="text-xs font-semibold text-brand-900">{j.dokterNama}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{j.spesialisasi}</p>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-brand-900">{j.hari}</span>
                    <span className="block text-[10px] text-muted">
                      {j.tanggal ? formatShort(j.tanggal) : "Berulang mingguan"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-900">
                    {formatTimeRange(j.jamMulai, j.jamSelesai)}
                  </p>
                  <div className="text-xs">
                    <span className="text-slate-700">{j.lokasi}</span>
                    <span className="block text-[10px] text-muted">Kuota {j.kuota} pasien</span>
                  </div>
                  <div>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(j)}>
                      {j.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                    <Link
                      href={`/admin/jadwal-dokter/${j.id}/edit`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-xs font-semibold text-brand-900 hover:bg-brand-50"
                      title="Edit jadwal"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(j)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs text-red-600 hover:bg-red-50"
                      aria-label={`Hapus jadwal ${j.dokterNama}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="Tidak ada jadwal dokter"
            description="Tambahkan jadwal praktik dokter baru atau ubah filter pencarian."
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Jadwal Dokter?"
        message={`Hapus jadwal praktik ${deleteTarget?.dokterNama} pada hari ${deleteTarget?.hari}?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}


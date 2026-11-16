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
import { deleteKegiatan, useData } from "@/services/dataService";
import { formatShort, formatTimeRange } from "@/lib/date";
import { JENIS_KEGIATAN } from "@/lib/selectors";

/** Kelola Kegiatan (Tabel + Filter + Aksi Edit/Hapus — PRD KK-1). */
export default function AdminKegiatanListView() {
  const data = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [jenis, setJenis] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!data) return <Loader />;

  const q = query.trim().toLowerCase();
  const list = data.kegiatan
    .filter((k) => {
      const matchQ =
        !q ||
        k.nama.toLowerCase().includes(q) ||
        k.penyelenggara.toLowerCase().includes(q) ||
        k.lokasi.toLowerCase().includes(q);
      const matchJenis = jenis === "all" || k.jenis === jenis;
      return matchQ && matchJenis;
    })
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteKegiatan(deleteTarget.id);
    toast(`Kegiatan "${deleteTarget.nama}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader
        title="Kelola Jadwal Kegiatan"
        subtitle="Daftar kegiatan penyuluhan, pemeriksaan, dan seminar kesehatan Posyandu Banjar Agung."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-brand-900">
          Total {list.length} kegiatan ditampilkan
        </p>
        <Button href="/admin/kegiatan/tambah">
          <Plus size={16} /> Tambah jadwal kegiatan
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_200px]">
        <Input
          type="search"
          placeholder="Cari nama kegiatan, lokasi, atau penyelenggara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Cari kegiatan"
        />
        <Select value={jenis} onChange={(e) => setJenis(e.target.value)} aria-label="Filter jenis">
          <option value="all">Semua jenis</option>
          {Object.entries(JENIS_KEGIATAN).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </Select>
      </div>

      {list.length > 0 ? (
        <Card className="mt-4 overflow-hidden">
          <div className="hidden grid-cols-[1.6fr_105px_1.1fr_1.1fr_110px] bg-brand-50 px-5 py-3 text-[11px] font-semibold text-brand-900 md:grid">
            <span>Nama & Penyelenggara</span>
            <span>Jenis</span>
            <span>Tanggal & Waktu</span>
            <span>Lokasi & Kuota</span>
            <span className="text-right">Aksi</span>
          </div>

          <div className="divide-y divide-line">
            {list.map((k) => {
              const info = JENIS_KEGIATAN[k.jenis] || JENIS_KEGIATAN.seminar;
              return (
                <div
                  key={k.id}
                  className="grid gap-2 px-5 py-4 md:grid-cols-[1.6fr_105px_1.1fr_1.1fr_110px] md:items-center"
                >
                  <div>
                    <p className="text-xs font-semibold text-brand-900">{k.nama}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{k.penyelenggara}</p>
                  </div>
                  <div>
                    <Badge tone={info.tone}>{info.label}</Badge>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-brand-900">{formatShort(k.tanggal)}</span>
                    <span className="block text-[10px] text-muted">
                      {formatTimeRange(k.waktuMulai, k.waktuSelesai)}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-700">{k.lokasi}</span>
                    <span className="block text-[10px] text-muted">Kuota {k.kuota} peserta</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/kegiatan/${k.id}/edit`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-xs font-semibold text-brand-900 hover:bg-brand-50"
                      title="Edit kegiatan"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(k)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs text-red-600 hover:bg-red-50"
                      aria-label={`Hapus ${k.nama}`}
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
            title="Tidak ada jadwal kegiatan"
            description="Tambahkan kegiatan kesehatan baru atau ubah kata kunci pencarian."
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Jadwal Kegiatan?"
        message={`Hapus kegiatan "${deleteTarget?.nama}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}


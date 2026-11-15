"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { deleteJurnal, setJurnalStatus, useData } from "@/services/dataService";
import { formatShort, todayISO } from "@/lib/date";
import { kategoriNama } from "@/lib/selectors";

/** Kelola Jurnal (Tabel Daftar + Filter + Aksi CRUD — PRD KJ-1, KJ-6). */
export default function AdminJurnalListView() {
  const data = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!data) return <Loader />;

  const q = query.trim().toLowerCase();
  const list = data.jurnal.filter((j) => {
    const matchQ =
      !q ||
      j.judul.toLowerCase().includes(q) ||
      j.penulis.toLowerCase().includes(q);
    const matchStatus = status === "all" || j.status === status;
    return matchQ && matchStatus;
  });

  const togglePublish = (item) => {
    const next = item.status === "terbit" ? "draft" : "terbit";
    setJurnalStatus(item.id, next, todayISO());
    toast(
      next === "terbit"
        ? `Jurnal "${item.judul}" diterbitkan.`
        : `Jurnal "${item.judul}" ditarik ke draft.`
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteJurnal(deleteTarget.id);
    toast(`Jurnal "${deleteTarget.judul}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader
        title="Kelola Jurnal Kesehatan"
        subtitle="Daftar seluruh artikel jurnal kesehatan yang tersimpan di portal."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={status === "all"} onClick={() => setStatus("all")}>
            Semua ({data.jurnal.length})
          </Chip>
          <Chip active={status === "terbit"} onClick={() => setStatus("terbit")}>
            Terbit ({data.jurnal.filter((j) => j.status === "terbit").length})
          </Chip>
          <Chip active={status === "draft"} onClick={() => setStatus("draft")}>
            Draft ({data.jurnal.filter((j) => j.status === "draft").length})
          </Chip>
        </div>

        <Button href="/admin/jurnal/tambah">
          <Plus size={16} /> Tambah jurnal kesehatan
        </Button>
      </div>

      <div className="mt-4">
        <Input
          type="search"
          placeholder="Cari judul jurnal atau nama penulis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Cari jurnal"
        />
      </div>

      {list.length > 0 ? (
        <Card className="mt-4 overflow-hidden">
          <div className="hidden grid-cols-[1.8fr_1fr_1fr_90px_210px] bg-brand-50 px-5 py-3 text-[11px] font-semibold text-brand-900 md:grid">
            <span>Judul & Kategori</span>
            <span>Penulis</span>
            <span>Tanggal terbit</span>
            <span>Status</span>
            <span className="text-right">Aksi</span>
          </div>

          <div className="divide-y divide-line">
            {list.map((j) => (
              <div
                key={j.id}
                className="grid gap-2 px-5 py-4 md:grid-cols-[1.8fr_1fr_1fr_90px_210px] md:items-center"
              >
                <div>
                  <p className="text-xs font-semibold text-brand-900">{j.judul}</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {kategoriNama(data.kategori, j.kategoriId)} • {j.menitBaca} menit baca
                  </p>
                </div>
                <p className="text-xs text-slate-700">{j.penulis}</p>
                <p className="text-xs text-muted">
                  {j.tanggalTerbit ? formatShort(j.tanggalTerbit) : "—"}
                </p>
                <div>
                  <Badge tone={j.status === "terbit" ? "brand" : "amber"}>
                    {j.status === "terbit" ? "Terbit" : "Draft"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {j.status === "terbit" && (
                    <Link
                      href={`/jurnal/${j.slug}`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-xs text-muted hover:text-brand-900"
                      title="Lihat di portal"
                    >
                      <Eye size={13} />
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(j)}
                  >
                    {j.status === "terbit" ? "Tarik" : "Terbitkan"}
                  </Button>
                  <Link
                    href={`/admin/jurnal/${j.id}/edit`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-xs font-semibold text-brand-900 hover:bg-brand-50"
                    title="Edit jurnal"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(j)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs text-red-600 hover:bg-red-50"
                    aria-label={`Hapus ${j.judul}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="Tidak ada jurnal yang sesuai"
            description="Tambahkan jurnal kesehatan baru atau ubah kata kunci pencarian."
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Jurnal Kesehatan?"
        message={`Apakah Anda yakin ingin menghapus jurnal "${deleteTarget?.judul}"? Tindakan ini tidak dapat dibatalkan.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}


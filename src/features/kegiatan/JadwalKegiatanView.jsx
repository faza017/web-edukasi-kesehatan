"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import { useData } from "@/services/dataService";
import { formatDate, formatTimeRange, todayISO } from "@/lib/date";
import { JENIS_KEGIATAN } from "@/lib/selectors";

/** Jadwal Kegiatan Pengguna (PRD 6.5 — KEG-U1 s/d KEG-U4). */
export default function JadwalKegiatanView() {
  const data = useData();
  const [tab, setTab] = useState("upcoming");
  const [jenis, setJenis] = useState("all");
  const [selected, setSelected] = useState(null);

  if (!data) return <Loader />;

  const today = todayISO();
  const list = data.kegiatan
    .filter((k) => (tab === "upcoming" ? k.tanggal >= today : k.tanggal < today))
    .filter((k) => jenis === "all" || k.jenis === jenis)
    .sort((a, b) =>
      tab === "upcoming"
        ? a.tanggal.localeCompare(b.tanggal)
        : b.tanggal.localeCompare(a.tanggal)
    );

  return (
    <>
      <PageHeader
        title="Jadwal Kegiatan"
        subtitle="Ikuti kegiatan penyuluhan, pemeriksaan gratis, dan seminar kesehatan Puskesmas Banjar Agung."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
            Mendatang
          </Chip>
          <Chip active={tab === "past"} onClick={() => setTab("past")}>
            Selesai
          </Chip>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={jenis === "all"} onClick={() => setJenis("all")}>
            Semua jenis
          </Chip>
          {Object.entries(JENIS_KEGIATAN).map(([key, val]) => (
            <Chip key={key} active={jenis === key} onClick={() => setJenis(key)}>
              {val.label}
            </Chip>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {list.map((k) => {
            const info = JENIS_KEGIATAN[k.jenis] || JENIS_KEGIATAN.seminar;
            return (
              <Card key={k.id} accent className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={info.tone} uppercase>
                      {info.label}
                    </Badge>
                    <span className="text-[11px] text-muted">{k.penyelenggara}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-brand-900">{k.nama}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {k.deskripsi}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-700">
                    <p className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-700" />
                      {formatDate(k.tanggal)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} className="text-brand-700" />
                      {formatTimeRange(k.waktuMulai, k.waktuSelesai)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-brand-700" />
                      {k.lokasi}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={14} className="text-brand-700" />
                      Kuota {k.kuota} peserta
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-line flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setSelected(k)}>
                    Lihat detail
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="Belum ada jadwal kegiatan"
            description="Kegiatan kesehatan yang dijadwalkan puskesmas akan tampil di halaman ini."
          />
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.nama || "Detail Kegiatan"}
        footer={
          <Button variant="primary" onClick={() => setSelected(null)}>
            Tutup
          </Button>
        }
      >
        {selected && (
          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap gap-2">
              <Badge tone={JENIS_KEGIATAN[selected.jenis]?.tone} uppercase>
                {JENIS_KEGIATAN[selected.jenis]?.label || selected.jenis}
              </Badge>
              <Badge tone="gray">{selected.penyelenggara}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">{selected.deskripsi}</p>
            <div className="rounded-xl bg-brand-50/70 p-3.5 space-y-1.5 text-brand-900">
              <p>
                <strong>Tanggal:</strong> {formatDate(selected.tanggal)}
              </p>
              <p>
                <strong>Waktu:</strong> {formatTimeRange(selected.waktuMulai, selected.waktuSelesai)}
              </p>
              <p>
                <strong>Lokasi:</strong> {selected.lokasi}
              </p>
              <p>
                <strong>Kuota Peserta:</strong> {selected.kuota} peserta
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}


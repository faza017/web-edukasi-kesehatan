"use client";

import { useState } from "react";
import { Calendar, Clock, ExternalLink, MapPin, Users } from "lucide-react";
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
import { JENIS_KEGIATAN, unpackLokasiMaps } from "@/lib/selectors";

function resolveMapsHref(lokasi, mapsUrl) {
  const cleanUrl = (mapsUrl || "").trim();
  if (cleanUrl) return cleanUrl;
  const cleanLok = (lokasi || "").trim();
  if (!cleanLok) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${cleanLok} Banjar Agung`
  )}`;
}

/** Jadwal Kegiatan Pengguna dilengkapi tombol "Lihat Lokasi" menuju Google Maps. */
export default function JadwalKegiatanView() {
  const data = useData();
  const [tab, setTab] = useState("all");
  const [jenis, setJenis] = useState("all");
  const [selected, setSelected] = useState(null);

  if (!data) return <Loader />;

  const today = todayISO();
  const list = data.kegiatan
    .filter((k) => {
      if (tab === "all") return true;
      return tab === "upcoming" ? k.tanggal >= today : k.tanggal < today;
    })
    .filter((k) => jenis === "all" || k.jenis === jenis)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  return (
    <>
      <PageHeader
        title="Jadwal Kegiatan"
        subtitle="Ikuti kegiatan penyuluhan, pemeriksaan gratis, dan seminar kesehatan Posyandu Banjar Agung."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={tab === "all"} onClick={() => setTab("all")}>
            Semua Jadwal
          </Chip>
          <Chip active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
            Hari Ini & Mendatang
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
            const { lokasi, mapsUrl } = unpackLokasiMaps(k.lokasi, k.mapsUrl);
            const mapsHref = resolveMapsHref(lokasi, mapsUrl);

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
                  <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted">
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
                      <span>{lokasi}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={14} className="text-brand-700" />
                      Kuota {k.kuota} peserta
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-line pt-3.5">
                  {mapsHref && (
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-700 px-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-brand-800"
                    >
                      <MapPin size={13} /> Lihat Lokasi <ExternalLink size={12} />
                    </a>
                  )}
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
            description="Kegiatan kesehatan yang dijadwalkan posyandu akan tampil di halaman ini."
          />
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.nama || "Detail Kegiatan"}
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2.5">
            {selected &&
              (() => {
                const { lokasi, mapsUrl } = unpackLokasiMaps(
                  selected.lokasi,
                  selected.mapsUrl
                );
                const href = resolveMapsHref(lokasi, mapsUrl);
                return href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
                  >
                    <MapPin size={15} /> Lihat Lokasi di Google Maps <ExternalLink size={14} />
                  </a>
                ) : null;
              })()}
            <Button variant="outline" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          </div>
        }
      >
        {selected &&
          (() => {
            const { lokasi, mapsUrl } = unpackLokasiMaps(
              selected.lokasi,
              selected.mapsUrl
            );
            return (
              <div className="space-y-3 text-xs">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={JENIS_KEGIATAN[selected.jenis]?.tone} uppercase>
                    {JENIS_KEGIATAN[selected.jenis]?.label || selected.jenis}
                  </Badge>
                  <Badge tone="gray">{selected.penyelenggara}</Badge>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {selected.deskripsi}
                </p>
                <div className="space-y-1.5 rounded-xl bg-brand-50/70 p-3.5 text-brand-900">
                  <p>
                    <strong>Tanggal:</strong> {formatDate(selected.tanggal)}
                  </p>
                  <p>
                    <strong>Waktu:</strong>{" "}
                    {formatTimeRange(selected.waktuMulai, selected.waktuSelesai)}
                  </p>
                  <p>
                    <strong>Lokasi:</strong> {lokasi}
                  </p>
                  {mapsUrl && (
                    <p className="truncate">
                      <strong>Google Maps:</strong>{" "}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-700 underline"
                      >
                        {mapsUrl}
                      </a>
                    </p>
                  )}
                  <p>
                    <strong>Kuota Peserta:</strong> {selected.kuota} peserta
                  </p>
                </div>
              </div>
            );
          })()}
      </Modal>
    </>
  );
}

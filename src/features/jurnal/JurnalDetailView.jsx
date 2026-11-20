"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Check, Clock, Download, FileText, Heart, Share2, User } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import JurnalCard from "@/features/jurnal/JurnalCard";
import { useData } from "@/services/dataService";
import { formatDate } from "@/lib/date";
import { jurnalImageUrl, jurnalTerbit, kategoriNama } from "@/lib/selectors";
import { formatBytes } from "@/lib/utils";

/** Halaman Detail Jurnal (PRD JRN-6) dilengkapi Gambar Utama Jurnal. */
export default function JurnalDetailView({ slug }) {
  const data = useData();
  const [helpful, setHelpful] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return <Loader />;

  const item = data.jurnal.find((j) => j.slug === slug && j.status === "terbit");

  if (!item) {
    return (
      <>
        <PageHeader title="Jurnal Tidak Ditemukan" subtitle="Artikel yang Anda cari tidak tersedia." />
        <EmptyState
          title="Jurnal tidak ditemukan"
          description="Jurnal mungkin telah ditarik atau alamat tautan tidak sesuai."
          action={
            <Button href="/jurnal" variant="outline" size="sm">
              <ArrowLeft size={14} /> Kembali ke Jurnal Kesehatan
            </Button>
          }
        />
      </>
    );
  }

  const katNama = kategoriNama(data.kategori, item.kategoriId);
  const heroImg = jurnalImageUrl(item);
  const lainnya = jurnalTerbit(data.jurnal)
    .filter((j) => j.id !== item.id)
    .slice(0, 3);

  const paragraphs = (item.isi || item.ringkasan || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const isNonImageAttachment =
    item.berkas &&
    item.berkas.dataUrl &&
    !item.berkas.type?.startsWith("image/") &&
    !item.berkas.name?.match(/\.(jpg|jpeg|png|webp|svg)$/i);

  return (
    <>
      <div className="mb-4">
        <Link
          href="/jurnal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand-900"
        >
          <ArrowLeft size={14} /> Kembali ke Jurnal Kesehatan
        </Link>
      </div>

      <Card accent className="overflow-hidden p-6 sm:p-8">
        <Badge uppercase>{katNama}</Badge>
        <h1 className="mt-4 text-2xl font-bold text-brand-900 sm:text-[28px]">{item.judul}</h1>
        <p className="mt-2 text-sm text-muted">{item.ringkasan}</p>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-line py-3.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 font-medium text-brand-900">
            <User size={14} /> {item.penulis}
          </span>
          {item.tanggalTerbit && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(item.tanggalTerbit)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} /> {item.menitBaca} menit baca
          </span>
        </div>

        {/* Gambar Ilustrasi / Unggahan Jurnal */}
        {heroImg && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-brand-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImg}
              alt={item.judul}
              className="max-h-[420px] w-full object-cover"
            />
          </div>
        )}

        {/* Isi Artikel */}
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {/* Bar Interaksi Pembaca (Apresiasi & Bagikan) */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-brand-50/40 px-4 py-3.5">
          <p className="text-xs font-semibold text-brand-900">
            Apakah artikel kesehatan ini bermanfaat bagi Anda?
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setHelpful((v) => !v)}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                helpful
                  ? "border-brand-700 bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white shadow-sm shadow-pink-500/25"
                  : "border-line bg-white text-brand-900 hover:border-brand-600"
              }`}
            >
              <Heart size={14} className={helpful ? "fill-white" : "text-brand-700"} />
              {helpful ? "Terima kasih! (Bermanfaat)" : "Ya, Bermanfaat"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard?.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 text-xs font-semibold text-brand-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-600 active:scale-95"
            >
              {copied ? <Check size={14} className="text-brand-700" /> : <Share2 size={14} />}
              {copied ? "Tautan Disalin!" : "Bagikan Artikel"}
            </button>
          </div>
        </div>

        {/* Lampiran Berkas Dokumen (PDF / DOCX) */}
        {isNonImageAttachment && (
          <div className="mt-8 rounded-xl border border-line bg-brand-50/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <FileText size={18} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-brand-900">{item.berkas.name}</p>
                  <p className="text-[11px] text-muted">
                    {item.berkas.type || "Berkas lampiran"} • {formatBytes(item.berkas.size)}
                  </p>
                </div>
              </div>
              <a
                href={item.berkas.dataUrl}
                download={item.berkas.name}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-700 px-3.5 text-xs font-semibold text-white hover:bg-brand-800"
              >
                <Download size={14} /> Unduh Berkas
              </a>
            </div>
          </div>
        )}
      </Card>

      {lainnya.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-brand-900">Jurnal kesehatan lainnya</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lainnya.map((j) => (
              <JurnalCard
                key={j.id}
                jurnal={j}
                kategori={kategoriNama(data.kategori, j.kategoriId)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

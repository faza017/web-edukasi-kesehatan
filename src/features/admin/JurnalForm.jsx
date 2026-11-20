"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, ImagePlus, Trash2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { createJurnal, updateJurnal, useData } from "@/services/dataService";
import { todayISO } from "@/lib/date";
import { estimateReadMinutes, formatBytes } from "@/lib/utils";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB (PRD KJ-3)
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf", ".docx"];

/** Frame 06 — Tambah / Edit Jurnal Kesehatan dilengkapi Upload Gambar ke Supabase Storage. */
export default function JurnalForm({ editId }) {
  const data = useData();
  const router = useRouter();
  const toast = useToast();

  const existing = editId && data ? data.jurnal.find((j) => j.id === editId) : null;

  const [values, setValues] = useState(() => ({
    judul: existing?.judul || "",
    kategoriId: existing?.kategoriId || "",
    penulis: existing?.penulis || "",
    ringkasan: existing?.ringkasan || "",
    isi: existing?.isi || "",
    berkas: existing?.berkas || null,
  }));
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!data) return <Loader />;

  if (editId && !existing) {
    return (
      <>
        <PageHeader title="Jurnal Tidak Ditemukan" />
        <Button href="/admin/jurnal" variant="outline">
          <ArrowLeft size={14} /> Kembali ke daftar jurnal
        </Button>
      </>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleFile = async (file) => {
    if (!file) return;
    const ext = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    if (!ALLOWED_EXT.includes(ext)) {
      setErrors((er) => ({
        ...er,
        berkas: "Format gambar/berkas harus JPG, PNG, WEBP, SVG, PDF, atau DOCX.",
      }));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrors((er) => ({
        ...er,
        berkas: "Ukuran berkas maksimal 10 MB.",
      }));
      return;
    }

    setErrors((er) => ({ ...er, berkas: undefined }));
    setUploading(true);

    // Unggah ke endpoint backend (/api/upload -> Supabase Storage bucket `jurnal-berkas`)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.berkas) {
        setValues((v) => ({ ...v, berkas: json.berkas }));
        setUploading(false);
        toast("Gambar berhasil diunggah ke penyimpanan server.");
        return;
      }
    } catch {
      // Lanjut ke fallback FileReader di bawah jika gagal
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValues((v) => ({
        ...v,
        berkas: {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: typeof reader.result === "string" ? reader.result : null,
        },
      }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!values.judul.trim()) next.judul = "Judul jurnal wajib diisi.";
    else if (values.judul.trim().length > 150) next.judul = "Judul maksimal 150 karakter.";
    if (!values.kategoriId) next.kategoriId = "Kategori wajib dipilih.";
    if (!values.penulis.trim()) next.penulis = "Nama penulis wajib diisi.";
    if (!values.ringkasan.trim()) next.ringkasan = "Deskripsi singkat wajib diisi.";
    else if (values.ringkasan.trim().length > 200)
      next.ringkasan = "Deskripsi singkat maksimal 200 karakter.";
    if (!values.isi.trim()) next.isi = "Isi artikel jurnal wajib diisi.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = (status) => {
    if (!validate()) return;
    const payload = {
      judul: values.judul.trim(),
      kategoriId: values.kategoriId,
      penulis: values.penulis.trim(),
      ringkasan: values.ringkasan.trim(),
      isi: values.isi.trim() || values.ringkasan.trim(),
      berkas: values.berkas,
      menitBaca: estimateReadMinutes(`${values.ringkasan} ${values.isi}`),
      status,
      tanggalTerbit: status === "terbit" ? existing?.tanggalTerbit || todayISO() : null,
    };

    try {
      if (existing) {
        updateJurnal(existing.id, payload);
        toast("Perubahan jurnal berhasil disimpan ke database.");
      } else {
        createJurnal(payload);
        toast(
          status === "terbit"
            ? "Jurnal berhasil dipublikasikan."
            : "Jurnal disimpan sebagai draft."
        );
      }
      router.push("/admin/jurnal");
    } catch (err) {
      toast(err.message || "Gagal menyimpan jurnal.", "error");
    }
  };

  const isPreviewImage =
    values.berkas?.dataUrl &&
    (values.berkas.type?.startsWith("image/") ||
      values.berkas.name?.match(/\.(jpg|jpeg|png|webp|svg)$/i));

  return (
    <>
      <PageHeader
        title={existing ? "Edit Jurnal Kesehatan" : "Tambah Jurnal Kesehatan"}
        subtitle="Kelola dan publikasikan artikel edukasi kesehatan Lansia, Ibu Hamil (Bumil), dan Balita."
      />

      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-bold text-brand-900">Informasi Jurnal</h2>
        <p className="mt-1 text-xs text-muted">
          Lengkapi judul, kategori, gambar ilustrasi, deskripsi singkat, dan isi artikel.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-5">
          <Field
            label="Judul Jurnal"
            htmlFor="judul"
            error={errors.judul}
            hint={`${values.judul.length}/150 karakter`}
          >
            <Input
              id="judul"
              name="judul"
              maxLength={150}
              placeholder="Contoh: Panduan MPASI Bergizi Seimbang untuk Balita"
              value={values.judul}
              onChange={onChange}
              error={errors.judul}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori Jurnal" htmlFor="kategoriId" error={errors.kategoriId}>
              <Select
                id="kategoriId"
                name="kategoriId"
                value={values.kategoriId}
                onChange={onChange}
                error={errors.kategoriId}
              >
                <option value="">Pilih kategori (Lansia / Ibu Hamil / Balita)</option>
                {data.kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Penulis" htmlFor="penulis" error={errors.penulis}>
              <Input
                id="penulis"
                name="penulis"
                placeholder="Nama bidan / petugas kesehatan"
                value={values.penulis}
                onChange={onChange}
                error={errors.penulis}
              />
            </Field>
          </div>

          <Field
            label="Deskripsi Singkat"
            htmlFor="ringkasan"
            error={errors.ringkasan}
            hint={`Tampil pada kartu jurnal (${values.ringkasan.length}/200 karakter)`}
          >
            <Input
              id="ringkasan"
              name="ringkasan"
              maxLength={200}
              placeholder="Tuliskan ringkasan singkat isi jurnal..."
              value={values.ringkasan}
              onChange={onChange}
              error={errors.ringkasan}
            />
          </Field>

          <Field
            label="Isi Artikel"
            htmlFor="isi"
            error={errors.isi}
            hint="Tuliskan pembahasan lengkap artikel kesehatan yang akan dibaca warga."
          >
            <Textarea
              id="isi"
              name="isi"
              rows={6}
              placeholder="Tuliskan isi lengkap artikel edukasi kesehatan..."
              value={values.isi}
              onChange={onChange}
              error={errors.isi}
            />
          </Field>

          {/* Unggah Gambar / Ilustrasi Jurnal */}
          <Field
            label="Unggah Gambar Jurnal (Dari Perangkat)"
            htmlFor="berkas-input"
            error={errors.berkas}
            hint="Jika tidak diunggah, sistem otomatis memakai gambar ilustrasi sesuai kategori (Lansia/Bumil/Balita)."
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-7 text-center transition-colors ${
                dragging
                  ? "border-brand-700 bg-brand-50"
                  : "border-line bg-brand-50/30 hover:border-brand-700"
              }`}
            >
              <input
                id="berkas-input"
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.pdf,.docx"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {uploading ? (
                <p className="text-xs font-semibold text-brand-700">
                  Mengunggah gambar ke Supabase Storage...
                </p>
              ) : values.berkas ? (
                <div className="flex w-full max-w-md flex-col items-center gap-3">
                  {isPreviewImage && (
                    <div className="overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={values.berkas.dataUrl}
                        alt="Preview gambar jurnal"
                        className="max-h-44 w-auto rounded-lg object-contain"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <FileText size={16} />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-brand-900">{values.berkas.name}</p>
                      <p className="text-[11px] text-muted">{formatBytes(values.berkas.size)}</p>
                    </div>
                    <label
                      htmlFor="berkas-input"
                      className="cursor-pointer rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-semibold text-brand-900 hover:bg-brand-50"
                    >
                      Ganti Gambar
                    </label>
                    <button
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, berkas: null }))}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={13} /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor="berkas-input" className="cursor-pointer">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <ImagePlus size={20} />
                  </span>
                  <p className="mt-3 text-xs font-bold text-brand-900">
                    Klik untuk memilih gambar dari perangkat atau seret ke sini
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    Mendukung format JPG, PNG, WEBP, SVG (atau PDF/DOCX) • Maks. 10 MB
                  </p>
                </label>
              )}
            </div>
          </Field>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => save("draft")} disabled={uploading}>
              Simpan sebagai draft
            </Button>
            <Button variant="primary" onClick={() => save("terbit")} disabled={uploading}>
              Publikasikan jurnal
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 font-semibold text-muted hover:text-brand-900"
        >
          <ArrowLeft size={14} /> Kembali ke dashboard admin
        </Link>
        <span>Jurnal terbit beserta gambarnya langsung tampil di halaman pengguna.</span>
      </div>
    </>
  );
}

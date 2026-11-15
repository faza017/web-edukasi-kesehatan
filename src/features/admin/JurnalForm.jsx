"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Trash2, Upload } from "lucide-react";
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
const ALLOWED_EXT = [".pdf", ".docx", ".jpg", ".jpeg", ".png"];

/** Frame 06 — Tambah / Edit Jurnal Kesehatan (PRD KJ-2 s/d KJ-7). */
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
        berkas: "Format berkas harus PDF, DOCX, atau JPG/PNG.",
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

    // Unggah ke endpoint backend (/api/upload -> Supabase Storage bucket `jurnal-berkas`)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.berkas) {
        setValues((v) => ({ ...v, berkas: json.berkas }));
        return;
      }
    } catch {
      // Lanjut ke fallback FileReader di bawah jika gagal
    }

    if (file.size <= 1.5 * 1024 * 1024) {
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
      };
      reader.readAsDataURL(file);
    } else {
      setValues((v) => ({
        ...v,
        berkas: { name: file.name, size: file.size, type: file.type, dataUrl: null },
      }));
    }
  };

  const validate = () => {
    const next = {};
    if (!values.judul.trim()) next.judul = "Judul jurnal wajib diisi.";
    else if (values.judul.trim().length > 150) next.judul = "Judul maksimal 150 karakter.";
    if (!values.kategoriId) next.kategoriId = "Kategori wajib dipilih.";
    if (!values.penulis.trim()) next.penulis = "Nama penulis wajib diisi.";
    if (!values.ringkasan.trim()) next.ringkasan = "Ringkasan wajib diisi.";
    else if (values.ringkasan.trim().length > 200) next.ringkasan = "Ringkasan maksimal 200 karakter.";
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
        toast("Perubahan jurnal berhasil disimpan.");
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

  return (
    <>
      <PageHeader
        title={existing ? "Edit Jurnal Kesehatan" : "Tambah Jurnal Kesehatan"}
        subtitle="Kelola dan publikasikan artikel informasi kesehatan."
      />

      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-bold text-brand-900">Informasi Jurnal</h2>
        <p className="mt-1 text-xs text-muted">
          Lengkapi detail artikel yang ingin ditampilkan di halaman utama.
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
              placeholder="Contoh: Tips Menjaga Pola Tidur"
              value={values.judul}
              onChange={onChange}
              error={errors.judul}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori" htmlFor="kategoriId" error={errors.kategoriId}>
              <Select
                id="kategoriId"
                name="kategoriId"
                value={values.kategoriId}
                onChange={onChange}
                error={errors.kategoriId}
              >
                <option value="">Pilih kategori jurnal</option>
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
                placeholder="Nama penulis"
                value={values.penulis}
                onChange={onChange}
                error={errors.penulis}
              />
            </Field>
          </div>

          <Field
            label="Ringkasan Singkat"
            htmlFor="ringkasan"
            error={errors.ringkasan}
            hint={`Tampil pada kartu jurnal (${values.ringkasan.length}/200 karakter)`}
          >
            <Input
              id="ringkasan"
              name="ringkasan"
              maxLength={200}
              placeholder="Contoh: Bangun rutinitas istirahat yang lebih teratur setiap hari."
              value={values.ringkasan}
              onChange={onChange}
              error={errors.ringkasan}
            />
          </Field>

          <Field
            label="Isi Artikel (Opsional)"
            htmlFor="isi"
            hint="Tuliskan isi lengkap artikel jika ingin dapat dibaca langsung di halaman detail."
          >
            <Textarea
              id="isi"
              name="isi"
              rows={5}
              placeholder="Tuliskan isi artikel edukasi kesehatan..."
              value={values.isi}
              onChange={onChange}
            />
          </Field>

          {/* Unggah Berkas Drag & Drop (KJ-3) */}
          <Field label="Unggah Berkas" htmlFor="berkas-input" error={errors.berkas}>
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
              className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition-colors ${dragging
                  ? "border-brand-700 bg-brand-50"
                  : "border-line bg-[#f9fcfa] hover:border-brand-700"
                }`}
            >
              <input
                id="berkas-input"
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {values.berkas ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <FileText size={18} />
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-brand-900">{values.berkas.name}</p>
                    <p className="text-[11px] text-muted">{formatBytes(values.berkas.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValues((v) => ({ ...v, berkas: null }))}
                    className="ml-2 inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              ) : (
                <label htmlFor="berkas-input" className="cursor-pointer">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <Upload size={18} />
                  </span>
                  <p className="mt-3 text-xs font-bold text-brand-900">
                    Seret dan lepas berkas di sini
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    atau klik untuk memilih file dari perangkat Anda
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    Format PDF, DOCX, atau JPG • Maks. 10 MB
                  </p>
                </label>
              )}
            </div>
          </Field>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => save("draft")}>
              Simpan sebagai draft
            </Button>
            <Button variant="primary" onClick={() => save("terbit")}>
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
        <span>Jurnal terbit akan tampil di halaman pengguna.</span>
      </div>
    </>
  );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { createKegiatan, updateKegiatan, useData } from "@/services/dataService";
import { timeToMinutes, todayISO } from "@/lib/date";

const INITIAL = {
  nama: "",
  jenis: "seminar",
  penyelenggara: "",
  tanggal: "",
  waktuMulai: "09:00",
  waktuSelesai: "12:00",
  lokasi: "",
  kuota: "50",
  deskripsi: "",
};

/** Frame 08 — Tambah / Edit Jadwal Kegiatan (PRD KK-2 s/d KK-4). */
export default function KegiatanForm({ editId }) {
  const data = useData();
  const router = useRouter();
  const toast = useToast();

  const existing = editId && data ? data.kegiatan.find((k) => k.id === editId) : null;

  const [values, setValues] = useState(() =>
    existing
      ? {
          nama: existing.nama,
          jenis: existing.jenis,
          penyelenggara: existing.penyelenggara,
          tanggal: existing.tanggal,
          waktuMulai: existing.waktuMulai,
          waktuSelesai: existing.waktuSelesai,
          lokasi: existing.lokasi,
          kuota: String(existing.kuota),
          deskripsi: existing.deskripsi || "",
        }
      : INITIAL
  );
  const [errors, setErrors] = useState({});

  if (!data) return <Loader />;

  if (editId && !existing) {
    return (
      <>
        <PageHeader title="Kegiatan Tidak Ditemukan" />
        <Button href="/admin/kegiatan" variant="outline">
          <ArrowLeft size={14} /> Kembali ke daftar kegiatan
        </Button>
      </>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const resetForm = () => {
    setValues(INITIAL);
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!values.nama.trim()) next.nama = "Nama kegiatan wajib diisi.";
    if (!values.jenis) next.jenis = "Jenis kegiatan wajib dipilih.";
    if (!values.penyelenggara.trim()) next.penyelenggara = "Penyelenggara wajib diisi.";
    if (!values.tanggal) {
      next.tanggal = "Tanggal kegiatan wajib diisi.";
    } else if (!existing && values.tanggal < todayISO()) {
      // PRD KK-3: tanggal tidak boleh di masa lalu (saat membuat)
      next.tanggal = "Tanggal kegiatan tidak boleh di masa lalu.";
    }
    if (!values.waktuMulai) next.waktuMulai = "Waktu mulai wajib diisi.";
    if (!values.waktuSelesai) next.waktuSelesai = "Waktu selesai wajib diisi.";
    if (
      values.waktuMulai &&
      values.waktuSelesai &&
      timeToMinutes(values.waktuSelesai) <= timeToMinutes(values.waktuMulai)
    ) {
      next.waktuSelesai = "Waktu selesai harus lebih besar dari waktu mulai.";
    }
    if (!values.lokasi.trim()) next.lokasi = "Lokasi kegiatan wajib diisi.";
    const kuotaNum = parseInt(values.kuota, 10);
    if (Number.isNaN(kuotaNum) || kuotaNum < 1) {
      next.kuota = "Kuota peserta minimal 1.";
    }
    if (!values.deskripsi.trim()) next.deskripsi = "Deskripsi kegiatan wajib diisi.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nama: values.nama.trim(),
      jenis: values.jenis,
      penyelenggara: values.penyelenggara.trim(),
      tanggal: values.tanggal,
      waktuMulai: values.waktuMulai,
      waktuSelesai: values.waktuSelesai,
      lokasi: values.lokasi.trim(),
      kuota: parseInt(values.kuota, 10),
      deskripsi: values.deskripsi.trim(),
    };

    if (existing) {
      updateKegiatan(existing.id, payload);
      toast("Jadwal kegiatan berhasil diperbarui.");
    } else {
      createKegiatan(payload);
      toast("Jadwal kegiatan baru berhasil disimpan.");
    }
    router.push("/admin/kegiatan");
  };

  return (
    <>
      <PageHeader
        title={existing ? "Edit Jadwal Kegiatan" : "Tambah Jadwal Kegiatan"}
        subtitle="Buat dan atur kegiatan kesehatan yang akan ditampilkan kepada pengguna."
      />

      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-bold text-brand-900">Informasi Kegiatan</h2>
        <p className="mt-1 text-xs text-muted">
          Lengkapi detail kegiatan kesehatan yang ingin dijadwalkan.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
          <Field label="Nama Kegiatan" htmlFor="nama" error={errors.nama}>
            <Input
              id="nama"
              name="nama"
              placeholder="Contoh: Seminar Pola Hidup Sehat"
              value={values.nama}
              onChange={onChange}
              error={errors.nama}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Jenis Kegiatan" htmlFor="jenis" error={errors.jenis}>
              <Select
                id="jenis"
                name="jenis"
                value={values.jenis}
                onChange={onChange}
                error={errors.jenis}
              >
                <option value="seminar">Seminar</option>
                <option value="pemeriksaan">Pemeriksaan</option>
                <option value="penyuluhan">Penyuluhan</option>
              </Select>
            </Field>

            <Field label="Penyelenggara" htmlFor="penyelenggara" error={errors.penyelenggara}>
              <Input
                id="penyelenggara"
                name="penyelenggara"
                placeholder="Nama instansi atau penanggung jawab"
                value={values.penyelenggara}
                onChange={onChange}
                error={errors.penyelenggara}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Tanggal Kegiatan" htmlFor="tanggal" error={errors.tanggal}>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                value={values.tanggal}
                onChange={onChange}
                error={errors.tanggal}
              />
            </Field>

            <Field label="Waktu Mulai" htmlFor="waktuMulai" error={errors.waktuMulai}>
              <Input
                id="waktuMulai"
                name="waktuMulai"
                type="time"
                value={values.waktuMulai}
                onChange={onChange}
                error={errors.waktuMulai}
              />
            </Field>

            <Field label="Waktu Selesai" htmlFor="waktuSelesai" error={errors.waktuSelesai}>
              <Input
                id="waktuSelesai"
                name="waktuSelesai"
                type="time"
                value={values.waktuSelesai}
                onChange={onChange}
                error={errors.waktuSelesai}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
            <Field label="Lokasi Kegiatan" htmlFor="lokasi" error={errors.lokasi}>
              <Input
                id="lokasi"
                name="lokasi"
                placeholder="Contoh: Aula Utama / Ruang Serbaguna"
                value={values.lokasi}
                onChange={onChange}
                error={errors.lokasi}
              />
            </Field>

            <Field label="Kuota Peserta" htmlFor="kuota" error={errors.kuota}>
              <Input
                id="kuota"
                name="kuota"
                type="number"
                min="1"
                placeholder="Contoh: 50 peserta"
                value={values.kuota}
                onChange={onChange}
                error={errors.kuota}
              />
            </Field>
          </div>

          <Field label="Deskripsi Kegiatan" htmlFor="deskripsi" error={errors.deskripsi}>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              rows={3}
              placeholder="Tuliskan informasi singkat mengenai kegiatan..."
              value={values.deskripsi}
              onChange={onChange}
              error={errors.deskripsi}
            />
          </Field>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button type="submit" variant="primary">
              Simpan jadwal
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
        <span>Kegiatan terjadwal akan tampil di halaman pengguna.</span>
      </div>
    </>
  );
}


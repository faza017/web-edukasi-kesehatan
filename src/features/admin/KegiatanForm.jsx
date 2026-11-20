"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { createKegiatan, updateKegiatan, useData } from "@/services/dataService";
import { timeToMinutes, todayISO } from "@/lib/date";
import { unpackLokasiMaps } from "@/lib/selectors";

const INITIAL = {
  nama: "",
  jenis: "seminar",
  penyelenggara: "",
  tanggal: "",
  waktuMulai: "09:00",
  waktuSelesai: "12:00",
  lokasi: "",
  mapsUrl: "",
  kuota: "50",
  deskripsi: "",
};

/** Frame 08 — Tambah / Edit Jadwal Kegiatan dilengkapi input Link Google Maps. */
export default function KegiatanForm({ editId }) {
  const data = useData();
  const router = useRouter();
  const toast = useToast();

  const existing = editId && data ? data.kegiatan.find((k) => k.id === editId) : null;

  const [values, setValues] = useState(() => {
    if (!existing) return INITIAL;
    const unpacked = unpackLokasiMaps(existing.lokasi, existing.mapsUrl);
    return {
      nama: existing.nama,
      jenis: existing.jenis,
      penyelenggara: existing.penyelenggara,
      tanggal: existing.tanggal,
      waktuMulai: existing.waktuMulai,
      waktuSelesai: existing.waktuSelesai,
      lokasi: unpacked.lokasi,
      mapsUrl: unpacked.mapsUrl,
      kuota: String(existing.kuota),
      deskripsi: existing.deskripsi || "",
    };
  });
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
    if (!values.lokasi.trim()) next.lokasi = "Nama tempat / lokasi kegiatan wajib diisi.";
    if (values.mapsUrl.trim() && !/^https?:\/\//i.test(values.mapsUrl.trim())) {
      next.mapsUrl = "Link Google Maps harus diawali http:// atau https://";
    }
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
      mapsUrl: values.mapsUrl.trim(),
      kuota: parseInt(values.kuota, 10),
      deskripsi: values.deskripsi.trim(),
    };

    if (existing) {
      updateKegiatan(existing.id, payload);
      toast("Jadwal kegiatan & lokasi Google Maps berhasil diperbarui.");
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
        subtitle="Buat dan atur kegiatan kesehatan beserta tautan lokasi Google Maps."
      />

      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-bold text-brand-900">Informasi Kegiatan</h2>
        <p className="mt-1 text-xs text-muted">
          Lengkapi detail kegiatan kesehatan dan link Google Maps yang ingin dijadwalkan.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
          <Field label="Nama Kegiatan" htmlFor="nama" error={errors.nama}>
            <Input
              id="nama"
              name="nama"
              placeholder="Contoh: Kelas BUMIL & Kelas BALITA"
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
                placeholder="Nama bidan / penanggung jawab"
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
            <Field label="Nama Tempat / Lokasi Kegiatan" htmlFor="lokasi" error={errors.lokasi}>
              <Input
                id="lokasi"
                name="lokasi"
                placeholder="Contoh: Perum Polda / Posyandu Kartika"
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

          <Field
            label="Link Google Maps Lokasi"
            htmlFor="mapsUrl"
            error={errors.mapsUrl}
            hint="Masukkan tautan Google Maps (mis. https://maps.app.goo.gl/... atau https://www.google.com/maps/...) agar warga bisa klik tombol 'Lihat Lokasi'."
          >
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-brand-700">
                <MapPin size={16} />
              </span>
              <Input
                id="mapsUrl"
                name="mapsUrl"
                type="url"
                placeholder="https://maps.app.goo.gl/... atau https://www.google.com/maps/..."
                value={values.mapsUrl}
                onChange={onChange}
                error={errors.mapsUrl}
                className="pl-10"
              />
            </div>
          </Field>

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
        <span>Kegiatan terjadwal beserta tombol Lihat Lokasi akan tampil di halaman pengguna.</span>
      </div>
    </>
  );
}

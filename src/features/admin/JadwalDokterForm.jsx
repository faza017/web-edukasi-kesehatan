"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import {
  createJadwalDokter,
  findBentrok,
  updateJadwalDokter,
  useData,
} from "@/services/dataService";
import { HARI_SENIN_DULU, dayName, timeToMinutes } from "@/lib/date";
import { poliDariLokasi } from "@/lib/selectors";

const INITIAL = {
  dokterNama: "",
  hari: "",
  tanggal: "",
  jamMulai: "09:00",
  jamSelesai: "12:00",
  lokasi: "",
  kuota: "15",
  status: "aktif",
};

/** Frame 07 — Tambah / Edit Jadwal Dokter (Tanpa kolom Spesialisasi). */
export default function JadwalDokterForm({ editId }) {
  const data = useData();
  const router = useRouter();
  const toast = useToast();

  const existing = editId && data ? data.jadwalDokter.find((j) => j.id === editId) : null;

  const [values, setValues] = useState(() =>
    existing
      ? {
          dokterNama: existing.dokterNama,
          hari: existing.hari || "",
          tanggal: existing.tanggal || "",
          jamMulai: existing.jamMulai,
          jamSelesai: existing.jamSelesai,
          lokasi: existing.lokasi,
          kuota: String(existing.kuota),
          status: existing.status,
        }
      : INITIAL
  );
  const [errors, setErrors] = useState({});

  if (!data) return <Loader />;

  if (editId && !existing) {
    return (
      <>
        <PageHeader title="Jadwal Tidak Ditemukan" />
        <Button href="/admin/jadwal-dokter" variant="outline">
          <ArrowLeft size={14} /> Kembali ke daftar jadwal
        </Button>
      </>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => {
      const next = { ...v, [name]: value };
      // Jika memilih tanggal spesifik, otomatis sesuaikan hari praktik.
      if (name === "tanggal" && value) {
        next.hari = dayName(value);
      }
      return next;
    });
    setErrors((er) => ({ ...er, [name]: undefined, bentrok: undefined }));
  };

  const resetForm = () => {
    setValues(INITIAL);
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!values.dokterNama.trim()) next.dokterNama = "Nama dokter wajib diisi.";
    if (!values.hari && !values.tanggal) next.hari = "Pilih hari praktik atau tanggal spesifik.";
    if (!values.jamMulai) next.jamMulai = "Jam mulai wajib diisi.";
    if (!values.jamSelesai) next.jamSelesai = "Jam selesai wajib diisi.";
    if (
      values.jamMulai &&
      values.jamSelesai &&
      timeToMinutes(values.jamSelesai) <= timeToMinutes(values.jamMulai)
    ) {
      next.jamSelesai = "Jam selesai harus lebih besar dari jam mulai.";
    }
    if (!values.lokasi.trim()) next.lokasi = "Lokasi / ruangan wajib diisi.";
    const kuotaNum = parseInt(values.kuota, 10);
    if (Number.isNaN(kuotaNum) || kuotaNum < 1) {
      next.kuota = "Kuota pasien minimal 1.";
    }

    // Validasi jadwal bentrok (PRD KD-3)
    if (Object.keys(next).length === 0) {
      const conflict = findBentrok(
        data.jadwalDokter,
        {
          dokterNama: values.dokterNama,
          hari: values.hari || dayName(values.tanggal),
          tanggal: values.tanggal || null,
          jamMulai: values.jamMulai,
          jamSelesai: values.jamSelesai,
        },
        existing?.id
      );
      if (conflict) {
        next.bentrok = `Jadwal bentrok untuk ${conflict.dokterNama} pada hari ${conflict.hari} (${conflict.jamMulai}–${conflict.jamSelesai}).`;
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      dokterNama: values.dokterNama.trim(),
      spesialisasi: poliDariLokasi(values.lokasi) || "Umum",
      hari: values.tanggal ? dayName(values.tanggal) : values.hari,
      tanggal: values.tanggal || null,
      jamMulai: values.jamMulai,
      jamSelesai: values.jamSelesai,
      lokasi: values.lokasi.trim(),
      kuota: parseInt(values.kuota, 10),
      status: values.status,
    };

    if (existing) {
      updateJadwalDokter(existing.id, payload);
      toast("Jadwal dokter berhasil diperbarui.");
    } else {
      createJadwalDokter(payload);
      toast("Jadwal dokter baru berhasil disimpan.");
    }
    router.push("/admin/jadwal-dokter");
  };

  return (
    <>
      <PageHeader
        title={existing ? "Edit Jadwal Dokter" : "Tambah Jadwal Dokter"}
        subtitle="Atur jadwal praktik dan ketersediaan dokter."
      />

      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-bold text-brand-900">Informasi Dokter</h2>
        <p className="mt-1 text-xs text-muted">Masukkan data dokter dan waktu praktik.</p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
          <Field label="Nama Dokter" htmlFor="dokterNama" error={errors.dokterNama}>
            <Input
              id="dokterNama"
              name="dokterNama"
              autoComplete="off"
              placeholder="dr. Nama Lengkap"
              value={values.dokterNama}
              onChange={onChange}
              error={errors.dokterNama}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Hari Praktik" htmlFor="hari" error={errors.hari}>
              <Select
                id="hari"
                name="hari"
                value={values.hari}
                onChange={onChange}
                error={errors.hari}
              >
                <option value="">Pilih hari</option>
                {HARI_SENIN_DULU.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Tanggal (Opsional)"
              htmlFor="tanggal"
              hint="Kosongkan untuk jadwal berulang mingguan"
            >
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                value={values.tanggal}
                onChange={onChange}
              />
            </Field>

            <Field label="Jam Mulai" htmlFor="jamMulai" error={errors.jamMulai}>
              <Input
                id="jamMulai"
                name="jamMulai"
                type="time"
                value={values.jamMulai}
                onChange={onChange}
                error={errors.jamMulai}
              />
            </Field>

            <Field label="Jam Selesai" htmlFor="jamSelesai" error={errors.jamSelesai}>
              <Input
                id="jamSelesai"
                name="jamSelesai"
                type="time"
                value={values.jamSelesai}
                onChange={onChange}
                error={errors.jamSelesai}
              />
            </Field>
          </div>

          <Field label="Lokasi / Ruangan" htmlFor="lokasi" error={errors.lokasi}>
            <Input
              id="lokasi"
              name="lokasi"
              placeholder="Contoh: Poli Umum — Ruang 02"
              value={values.lokasi}
              onChange={onChange}
              error={errors.lokasi}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kuota Pasien" htmlFor="kuota" error={errors.kuota}>
              <Input
                id="kuota"
                name="kuota"
                type="number"
                min="1"
                placeholder="Contoh: 15 pasien"
                value={values.kuota}
                onChange={onChange}
                error={errors.kuota}
              />
            </Field>

            <Field label="Status Jadwal" htmlFor="status">
              <Select id="status" name="status" value={values.status} onChange={onChange}>
                <option value="aktif">Aktif (Tersedia)</option>
                <option value="penuh">Penuh</option>
                <option value="dibatalkan">Dibatalkan / Tidak praktik</option>
                <option value="tidak_aktif">Tidak aktif (Sembunyikan)</option>
              </Select>
            </Field>
          </div>

          {errors.bentrok && (
            <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              {errors.bentrok}
            </p>
          )}

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
        <span>Jadwal aktif akan tampil di halaman pengguna.</span>
      </div>
    </>
  );
}

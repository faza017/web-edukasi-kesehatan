"use client";

import { useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Field, Input, Textarea } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import {
  createKategori,
  deleteKategori,
  resetDemoData,
  updatePengaturan,
  useData,
} from "@/services/dataService";

/** Halaman Pengaturan Portal & Kategori Jurnal (PRD Bagian 7 — PENGATURAN & KATEGORI). */
export default function AdminPengaturanView() {
  const data = useData();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [newKat, setNewKat] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  if (!data) return <Loader />;

  const values = form || data.pengaturan;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...(prev || data.pengaturan), [name]: value }));
  };

  const onSavePengaturan = (e) => {
    e.preventDefault();
    updatePengaturan(values);
    setForm(null);
    toast("Pengaturan layanan berhasil disimpan.");
  };

  const onAddKategori = (e) => {
    e.preventDefault();
    try {
      createKategori(newKat);
      setNewKat("");
      toast("Kategori jurnal berhasil ditambahkan.");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const onDeleteKategori = (id) => {
    try {
      deleteKategori(id);
      toast("Kategori berhasil dihapus.");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Pengaturan Portal"
        subtitle="Atur jam pelayanan, kontak bantuan, teks informasi kunjungan, dan kategori jurnal."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <h2 className="text-base font-bold text-brand-900">Informasi Posyandu & Layanan</h2>
          <p className="mt-1 text-xs text-muted">
            Ditampilkan pada Beranda, Sidebar Bantuan, dan halaman Jadwal Dokter.
          </p>

          <form onSubmit={onSavePengaturan} className="mt-5 space-y-4">
            <Field label="Nama Fasilitas Kesehatan" htmlFor="namaFaskes">
              <Input
                id="namaFaskes"
                name="namaFaskes"
                value={values.namaFaskes}
                onChange={onChange}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Jam Pelayanan" htmlFor="jamPelayanan">
                <Input
                  id="jamPelayanan"
                  name="jamPelayanan"
                  placeholder="08.00 – 15.00"
                  value={values.jamPelayanan}
                  onChange={onChange}
                />
              </Field>
              <Field label="Hari Pelayanan" htmlFor="hariPelayanan">
                <Input
                  id="hariPelayanan"
                  name="hariPelayanan"
                  placeholder="Senin – Jumat"
                  value={values.hariPelayanan}
                  onChange={onChange}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nomor Telepon" htmlFor="kontakTelepon">
                <Input
                  id="kontakTelepon"
                  name="kontakTelepon"
                  value={values.kontakTelepon}
                  onChange={onChange}
                />
              </Field>
              <Field label="Nomor WhatsApp (Format 628...)" htmlFor="kontakWhatsapp">
                <Input
                  id="kontakWhatsapp"
                  name="kontakWhatsapp"
                  value={values.kontakWhatsapp}
                  onChange={onChange}
                />
              </Field>
            </div>

            <Field
              label="Teks Informasi 'Sebelum Berkunjung'"
              htmlFor="sebelumBerkunjung"
              hint="Ditampilkan di bagian bawah halaman Jadwal Dokter (PRD JDW-7)."
            >
              <Textarea
                id="sebelumBerkunjung"
                name="sebelumBerkunjung"
                rows={3}
                value={values.sebelumBerkunjung}
                onChange={onChange}
              />
            </Field>

            <div className="flex justify-end pt-2">
              <Button type="submit">Simpan pengaturan</Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-brand-900">Kategori Jurnal Kesehatan</h2>
            <p className="mt-1 text-xs text-muted">
              Kelola daftar kategori yang muncul pada filter Jurnal Kesehatan (PRD JRN-3).
            </p>

            <form onSubmit={onAddKategori} className="mt-4 flex gap-2">
              <Input
                placeholder="Nama kategori baru..."
                value={newKat}
                onChange={(e) => setNewKat(e.target.value)}
                aria-label="Nama kategori baru"
              />
              <Button type="submit" className="shrink-0">
                <Plus size={16} /> Tambah
              </Button>
            </form>

            <ul className="mt-4 divide-y divide-line">
              {data.kategori.map((k) => {
                const count = data.jurnal.filter((j) => j.kategoriId === k.id).length;
                return (
                  <li key={k.id} className="flex items-center justify-between py-2.5 text-xs">
                    <div>
                      <span className="font-semibold text-brand-900">{k.nama}</span>
                      <span className="ml-2 text-muted">({count} jurnal)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteKategori(k.id)}
                      className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                      aria-label={`Hapus kategori ${k.nama}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-brand-900">Reset Data Demo</h2>
            <p className="mt-1 text-xs text-muted">
              Kembalikan seluruh jurnal, jadwal dokter, dan kegiatan ke data bawaan awal sesuai
              desain Figma.
            </p>
            <Button
              variant="danger-outline"
              size="sm"
              className="mt-4"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw size={14} /> Reset ke data awal
            </Button>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset Seluruh Data Demo?"
        message="Semua perubahan yang Anda buat di browser ini akan dikembalikan ke data awal sesuai desain Figma."
        confirmLabel="Ya, Reset Data"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          setForm(null);
          setConfirmReset(false);
          toast("Data berhasil dikembalikan ke kondisi awal.");
        }}
      />
    </>
  );
}


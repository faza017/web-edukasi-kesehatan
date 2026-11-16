import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4 text-center">
      <p className="rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-900">
        404 — Halaman Tidak Ditemukan
      </p>
      <h1 className="mt-4 text-2xl font-bold text-brand-900">
        Halaman yang Anda cari tidak tersedia
      </h1>
      <p className="mt-2 max-w-md text-xs text-muted">
        Periksa kembali alamat tautan atau kembali ke halaman utama Portal Kesehatan Posyandu
        Banjar Agung.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}


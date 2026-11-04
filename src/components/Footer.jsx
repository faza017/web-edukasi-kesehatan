import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white">
                +
              </div>
              <span className="text-lg font-bold text-white">
                Sehat<span className="text-emerald-400">Pedia</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Platform edukasi kesehatan berbasis bukti ilmiah yang membantu
              masyarakat Indonesia memahami gizi, kesehatan mental, kebugaran
              fisik, dan pencegahan penyakit secara mudah dan terpercaya.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Disclaimer: Seluruh informasi di web ini bersifat edukatif dan
              bukan pengganti diagnosis maupun saran medis langsung dari dokter.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigasi Utama
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-emerald-400">
                  Artikel Kesehatan
                </Link>
              </li>
              <li>
                <Link href="/kalkulator" className="hover:text-emerald-400">
                  Kalkulator BMI & Air
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-emerald-400">
                  Tentang Tim Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Kontak Darurat Medis
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Ambulans / Kemenkes: 119</li>
              <li>Hotline Kesehatan Jiwa: 119 ext 8</li>
              <li>BPJS Kesehatan Care Center: 165</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © 2026 SehatPedia — Proyek Web Edukasi Kesehatan (Next.js + React JSX).
        </div>
      </div>
    </footer>
  );
}

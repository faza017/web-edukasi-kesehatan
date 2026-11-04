export const metadata = {
  title: "Tentang Kami — SehatPedia",
  description:
    "Mengenal visi, misi, dan struktur kerangka kerja proyek web edukasi kesehatan SehatPedia.",
};

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Tentang Proyek Kami
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Membangun Literasi Kesehatan yang Mudah Diakses Semua Orang
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          <strong>SehatPedia</strong> adalah proyek web edukasi kesehatan yang
          dirancang untuk membantu masyarakat memahami konsep hidup sehat secara
          praktis, mulai dari pengaturan gizi harian, manajemen stres, olahraga,
          hingga deteksi dini faktor risiko penyakit.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Visi Kami</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Menjadi sumber edukasi kesehatan digital yang mudah dipahami,
              bebas hoaks medis, dan mendorong perubahan perilaku sehat sehari-hari.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Struktur Kerangka Proyek
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Dibangun menggunakan <strong>Next.js App Router</strong>,{" "}
              <strong>React (.jsx)</strong>, dan <strong>Tailwind CSS</strong>{" "}
              sehingga tim Anda dapat dengan mudah menambah halaman, artikel,
              maupun fitur interaktif baru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


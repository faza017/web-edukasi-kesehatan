import ArticleDirectory from "@/components/ArticleDirectory";

export const metadata = {
  title: "Artikel Edukasi Kesehatan — SehatPedia",
  description:
    "Kumpulan artikel edukasi kesehatan seputar gizi, kesehatan mental, olahraga, dan pencegahan penyakit.",
};

export default function ArtikelPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Pustaka Edukasi
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Artikel & Panduan Kesehatan
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Temukan informasi kesehatan yang telah dikurasi berdasarkan topik
          nutrisi, kebugaran fisik, kesehatan mental, dan pencegahan penyakit.
        </p>
      </div>

      <ArticleDirectory />
    </div>
  );
}


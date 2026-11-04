import Link from "next/link";
import { articles, categories, healthMyths } from "@/data/healthData";
import ArticleCard from "@/components/ArticleCard";
import HealthCalculator from "@/components/HealthCalculator";

export default function HomePage() {
  const featuredArticles = articles.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
                <span>🩺</span> Portal Edukasi Kesehatan Terpercaya
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.15]">
                Pahami Tubuh Anda, Mulai Hidup Lebih{" "}
                <span className="text-emerald-600">Sehat & Terarah</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Pelajari panduan gizi harian, manajemen kesehatan mental, porsi
                olahraga, hingga pencegahan penyakit yang disusun secara ringkas
                dan mudah dipraktikkan setiap hari.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/artikel"
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Jelajahi Artikel Edukasi
                </Link>
                <Link
                  href="/kalkulator"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                >
                  Cek BMI & Kebutuhan Air
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 sm:max-w-md">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Berbasis Bukti Medis</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600">4+</p>
                  <p className="text-xs text-slate-500">Pilar Kesehatan</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">Gratis</p>
                  <p className="text-xs text-slate-500">Akses Kalkulator</p>
                </div>
              </div>
            </div>

            {/* Kartu Highlight Cepat */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Checklist Sehat Hari Ini
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Rekomendasi Kemenkes
                  </span>
                </div>

                <ul className="mt-5 space-y-4">
                  {[
                    {
                      icon: "💧",
                      title: "Hidrasi 8 Gelas Air Putih",
                      desc: "Jaga fungsi ginjal dan fokus otak tetap optimal.",
                    },
                    {
                      icon: "🥗",
                      title: "Setengah Piring Sayur & Buah",
                      desc: "Penuhi serat harian dan antioksidan alami tubuh.",
                    },
                    {
                      icon: "🚶",
                      title: "Aktivitas Fisik 30 Menit",
                      desc: "Jalan cepat atau peregangan ringan setiap hari.",
                    },
                    {
                      icon: "😴",
                      title: "Tidur Berkualitas 7–8 Jam",
                      desc: "Optimalkan pemulihan sel imun di malam hari.",
                    },
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-2xs">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topik Kategori */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Pilar Edukasi Kesehatan
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pilih topik pembelajaran sesuai kebutuhan kesehatan Anda dan
              keluarga.
            </p>
          </div>
          <Link
            href="/artikel"
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            Lihat semua kategori →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((c) => c.id !== "semua")
            .map((cat) => (
              <Link
                key={cat.id}
                href="/artikel"
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500">
                    {cat.count} artikel tersedia
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Artikel Pilihan */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Artikel Edukasi Terbaru
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Ditulis dan ditinjau dengan bahasa yang ramah bagi masyarakat umum.
            </p>
          </div>
          <Link
            href="/artikel"
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            Semua Artikel ({articles.length}) →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Mitos vs Fakta Medis */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
          <div className="max-w-2xl">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Luruskan Hoaks Kesehatan
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Mitos vs Fakta Kesehatan Populer
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Jangan mudah percaya informasi berantai. Berikut penjelasan medis
              dari beberapa anggapan yang sering beredar.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {healthMyths.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Pernyataan Umum:
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  &ldquo;{item.myth}&rdquo;
                </p>
                <hr className="my-3 border-slate-200" />
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Penjelasan Medis:
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kalkulator Preview */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Cek Indeks Massa Tubuh & Hidrasi Anda
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Gunakan alat interaktif di bawah ini untuk memantau status gizi dan
            kebutuhan cairan harian secara langsung.
          </p>
        </div>
        <HealthCalculator />
      </section>
    </div>
  );
}


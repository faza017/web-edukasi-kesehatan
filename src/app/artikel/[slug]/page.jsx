import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/healthData";

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) {
    return { title: "Artikel Tidak Ditemukan — SehatPedia" };
  }
  return {
    title: `${article.title} — SehatPedia`,
    description: article.excerpt,
  };
}

export default async function DetailArtikelPage({ params }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/artikel"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:underline"
      >
        ← Kembali ke Daftar Artikel
      </Link>

      <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800">
            {article.categoryLabel}
          </span>
          <span>•</span>
          <span>{article.publishedAt}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          {article.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 border-y border-slate-100 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            Dr
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Ditinjau oleh: {article.author.name}
            </p>
            <p className="text-xs text-slate-500">{article.author.role}</p>
          </div>
        </div>

        {/* Poin Penting */}
        {article.highlights && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
            <h2 className="text-sm font-bold text-emerald-950">
              💡 Intisari Edukasi:
            </h2>
            <ul className="mt-2.5 list-inside list-disc space-y-1.5 text-sm text-emerald-900">
              {article.highlights.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Isi Artikel */}
        <div className="mt-8 space-y-6">
          {article.content.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-bold text-slate-900">
                {section.heading}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* Catatan Medis */}
        <div className="mt-10 rounded-2xl bg-slate-100 p-4 text-xs leading-relaxed text-slate-600">
          <strong>Catatan Medis:</strong> Artikel ini disusun untuk tujuan
          edukasi kesehatan masyarakat. Apabila Anda mengalami keluhan fisik atau
          psikologis yang menetap, segera kunjungi fasilitas layanan kesehatan
          terdekat.
        </div>
      </article>
    </div>
  );
}


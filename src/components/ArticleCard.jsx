import Link from "next/link";

const badgeColors = {
  nutrisi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  mental: "bg-purple-50 text-purple-700 border-purple-200",
  olahraga: "bg-sky-50 text-sky-700 border-sky-200",
  pencegahan: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function ArticleCard({ article }) {
  const badgeStyle =
    badgeColors[article.category] ||
    "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-semibold ${badgeStyle}`}
          >
            {article.categoryLabel}
          </span>
          <span className="text-slate-400">{article.readTime}</span>
        </div>

        <Link href={`/artikel/${article.slug}`} className="mt-3 block">
          <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600">
            {article.title}
          </h3>
        </Link>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {article.excerpt}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
        <div>
          <p className="font-semibold text-slate-800">{article.author.name}</p>
          <p className="text-slate-500">{article.author.role}</p>
        </div>
        <Link
          href={`/artikel/${article.slug}`}
          className="font-semibold text-emerald-600 group-hover:underline"
        >
          Baca →
        </Link>
      </div>
    </article>
  );
}


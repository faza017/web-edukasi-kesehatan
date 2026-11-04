"use client";

import { useState } from "react";
import { articles, categories } from "@/data/healthData";
import ArticleCard from "@/components/ArticleCard";

export default function ArticleDirectory() {
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "semua" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Filter & Search Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik kesehatan..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Daftar Artikel */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-base font-semibold text-slate-800">
            Artikel tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Coba gunakan kata kunci lain atau pilih kategori &quot;Semua Topik&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("semua");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}


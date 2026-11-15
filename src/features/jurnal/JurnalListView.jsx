"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Form";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import JurnalCard from "@/features/jurnal/JurnalCard";
import { useData } from "@/services/dataService";
import { jurnalTerbit, kategoriNama } from "@/lib/selectors";

const PAGE_SIZE = 9; // PRD JRN-5

/** Frame 03 — Jurnal Kesehatan (PRD JRN-1 s/d JRN-8). */
export default function JurnalListView() {
  const data = useData();
  const [query, setQuery] = useState("");
  const [kategoriId, setKategoriId] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  if (!data) return <Loader />;

  const q = query.trim().toLowerCase();
  const filtered = jurnalTerbit(data.jurnal)
    .filter((j) => {
      const katNama = kategoriNama(data.kategori, j.kategoriId).toLowerCase();
      const matchQuery =
        !q ||
        j.judul.toLowerCase().includes(q) ||
        j.ringkasan.toLowerCase().includes(q) ||
        katNama.includes(q);
      const matchKategori = kategoriId === "all" || j.kategoriId === kategoriId;
      return matchQuery && matchKategori;
    })
    .sort((a, b) => {
      const cmp = (b.tanggalTerbit || "").localeCompare(a.tanggalTerbit || "");
      return sort === "newest" ? cmp : -cmp;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilter = () => {
    setQuery("");
    setKategoriId("all");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Jurnal Kesehatan"
        subtitle="Temukan informasi dan tips untuk menjaga kesehatan Anda."
      />

      {/* Bar pencarian & urutan */}
      <div className="grid gap-3.5 sm:grid-cols-[1fr_210px]">
        <Input
          type="search"
          placeholder="Cari judul atau topik kesehatan..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          aria-label="Cari jurnal"
        />
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Urutkan jurnal"
          className="font-semibold text-brand-900"
        >
          <option value="newest">Terbaru dahulu</option>
          <option value="oldest">Terlama dahulu</option>
        </Select>
      </div>

      {/* Chip kategori */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Chip
          active={kategoriId === "all"}
          onClick={() => {
            setKategoriId("all");
            setPage(1);
          }}
        >
          Semua jurnal
        </Chip>
        {data.kategori.map((k) => (
          <Chip
            key={k.id}
            active={kategoriId === k.id}
            onClick={() => {
              setKategoriId(k.id);
              setPage(1);
            }}
          >
            {k.nama}
          </Chip>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold text-brand-900">{filtered.length} jurnal untuk Anda</p>

      {paginated.length > 0 ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((j) => (
              <JurnalCard
                key={j.id}
                jurnal={j}
                kategori={kategoriNama(data.kategori, j.kategoriId)}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onChange={setPage}
              itemLabel="jurnal"
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="Jurnal tidak ditemukan"
            description="Coba ubah kata kunci pencarian atau pilih kategori lain."
            action={
              <Button variant="outline" size="sm" onClick={resetFilter}>
                Reset filter
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}


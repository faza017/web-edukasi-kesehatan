import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatShort } from "@/lib/date";

/** Kartu jurnal dengan garis hijau di atas (Frame 02 & 03). */
export default function JurnalCard({ jurnal, kategori, showMeta = true }) {
  return (
    <Card as="article" accent className="flex flex-col p-4">
      <div>
        <Badge uppercase className="min-w-[110px] justify-start">
          {kategori}
        </Badge>
      </div>
      <h3 className="mt-4 text-base font-semibold text-brand-900">
        <Link href={`/jurnal/${jurnal.slug}`} className="hover:underline">
          {jurnal.judul}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-muted">{jurnal.ringkasan}</p>
      <div className="mt-auto pt-5">
        {showMeta && (
          <p className="mb-4 text-[10px] text-muted">
            {jurnal.tanggalTerbit ? formatShort(jurnal.tanggalTerbit) : "—"}
            <span className="mx-1.5">•</span>
            {jurnal.menitBaca} menit baca
          </p>
        )}
        <Link
          href={`/jurnal/${jurnal.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:text-brand-700"
        >
          Baca selengkapnya <ArrowRight size={12} />
        </Link>
      </div>
    </Card>
  );
}


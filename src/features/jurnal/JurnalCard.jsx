import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatShort } from "@/lib/date";
import { jurnalImageUrl } from "@/lib/selectors";

/** Kartu jurnal dengan gambar ilustrasi kategori / unggahan admin. */
export default function JurnalCard({ jurnal, kategori, showMeta = true }) {
  const imgUrl = jurnalImageUrl(jurnal);

  return (
    <Card
      as="article"
      className="group flex flex-col overflow-hidden border-line transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-lg hover:shadow-brand-700/10"
    >
      <Link
        href={`/jurnal/${jurnal.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-brand-50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={jurnal.judul}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge uppercase className="shadow-xs backdrop-blur-xs">
            {kategori}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold leading-snug text-brand-900">
          <Link href={`/jurnal/${jurnal.slug}`} className="hover:text-brand-700 hover:underline">
            {jurnal.judul}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted">
          {jurnal.ringkasan}
        </p>

        <div className="mt-auto pt-4">
          {showMeta && (
            <p className="mb-3 text-[11px] text-muted">
              {jurnal.tanggalTerbit ? formatShort(jurnal.tanggalTerbit) : "—"}
              <span className="mx-1.5">•</span>
              {jurnal.menitBaca} menit baca
            </p>
          )}
          <Link
            href={`/jurnal/${jurnal.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
          >
            Baca selengkapnya <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </Card>
  );
}

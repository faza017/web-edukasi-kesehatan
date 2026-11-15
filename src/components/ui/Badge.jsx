import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand-50 text-brand-900",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  sky: "bg-sky-50 text-sky-800",
  gray: "bg-slate-100 text-slate-600",
};

/** Badge berbentuk pill (kategori / status). */
export default function Badge({ tone = "brand", uppercase = false, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold",
        uppercase && "uppercase tracking-wide",
        tones[tone] || tones.brand,
        className
      )}
    >
      {children}
    </span>
  );
}


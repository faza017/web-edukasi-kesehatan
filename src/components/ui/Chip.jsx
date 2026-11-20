import { cn } from "@/lib/utils";

/** Chip filter kategori dengan efek pegas saat diklik/disentuh. */
export default function Chip({ active, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-95",
        active
          ? "bg-gradient-to-r from-[#ec4899] to-[#db2777] font-semibold text-white shadow-sm shadow-pink-500/25"
          : "border border-line bg-white text-muted hover:border-brand-600 hover:bg-brand-50/70 hover:text-brand-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

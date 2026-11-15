import { cn } from "@/lib/utils";

/** Chip filter kategori (PRD JRN-3). */
export default function Chip({ active, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "h-8 rounded-full px-4 text-xs font-medium transition-colors",
        active ? "bg-brand-700 font-semibold text-white" : "bg-white text-muted hover:bg-brand-50 hover:text-brand-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}


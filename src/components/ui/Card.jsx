import { cn } from "@/lib/utils";

/** Kartu putih dengan animasi masuk lembut & efek sentuhan hover. */
export default function Card({
  as: Tag = "div",
  accent = false,
  interactive = true,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "animate-fade-up rounded-2xl border border-line bg-white shadow-2xs",
        interactive && "interactive-card",
        accent && "overflow-hidden border-t-[6px] border-t-brand-700",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

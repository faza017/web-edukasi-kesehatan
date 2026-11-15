import { cn } from "@/lib/utils";

/** Kartu putih standar (radius 12–16px, border tipis). */
export default function Card({ as: Tag = "div", accent = false, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line bg-white",
        accent && "overflow-hidden border-t-[6px] border-t-brand-700",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}


import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

/** Tampilan kondisi kosong (PRD HOME-6, JRN-8). */
export default function EmptyState({ icon: Icon = SearchX, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-sm font-semibold text-brand-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}


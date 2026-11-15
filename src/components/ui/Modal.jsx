"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Dialog modal berbasis elemen <dialog> native (aksesibel & mendukung Esc). */
export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-2xl border border-line bg-white p-0 shadow-xl backdrop:bg-brand-900/40",
        size === "sm" ? "max-w-md" : "max-w-xl"
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
        <h2 className="text-base font-bold text-brand-900">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted hover:bg-brand-50 hover:text-brand-900"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-5 text-sm text-slate-700">{children}</div>
      {footer && <div className="flex justify-end gap-3 border-t border-line px-6 py-4">{footer}</div>}
    </dialog>
  );
}


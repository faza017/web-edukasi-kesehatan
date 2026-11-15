import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-lg border bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15 disabled:bg-slate-50 disabled:text-slate-500";

/** Pembungkus label + pesan error/hint untuk semua input (PRD AUTH-2, aksesibilitas). */
export function Field({ label, htmlFor, error, hint, required, className, children }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-muted">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(controlBase, "h-[42px]", error ? "border-red-400" : "border-line", className)}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
}

export function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(
        controlBase,
        "h-[42px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235f6f68%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_14px_center] bg-no-repeat pr-10",
        error ? "border-red-400" : "border-line",
        className
      )}
      aria-invalid={error ? true : undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(controlBase, "min-h-[96px] py-3", error ? "border-red-400" : "border-line", className)}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
}


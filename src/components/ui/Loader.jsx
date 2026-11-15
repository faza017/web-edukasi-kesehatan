export default function Loader({ label = "Memuat..." }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-700" />
        <span className="text-xs text-muted">{label}</span>
      </div>
    </div>
  );
}


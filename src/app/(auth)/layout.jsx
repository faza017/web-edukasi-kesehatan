import Image from "next/image";
import { BookOpen, CalendarCheck, Stethoscope } from "lucide-react";

/**
 * Konsep Baru Halaman Autentikasi (Non-Split, Centered Glassmorphic Portal):
 * Seluruh fokus berada tepat di tengah layar dengan latar emerald mesh modern,
 * header logo resmi di atas kartu, bingkai kaca (glassmorphism) pada kartu login,
 * dan 3 badge fitur di bagian bawah.
 */
export default function AuthLayout({ children }) {
  const highlights = [
    { icon: BookOpen, label: "Jurnal Kesehatan" },
    { icon: Stethoscope, label: "Jadwal Dokter" },
    { icon: CalendarCheck, label: "Kegiatan Posyandu" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b3320] via-[#145336] to-[#082416] px-4 py-10 text-white sm:px-6">
      {/* Efek pendaran cahaya (Mesh Glow) di latar belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#4ade80]/18 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#34d399]/12 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#a7f3d0]/10 blur-[90px]"
      />

      {/* Pola titik-titik halus (Subtle Medical Grid) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ornamen tanda plus medis mengambang di kiri & kanan layar */}
      <svg
        aria-hidden="true"
        viewBox="0 0 80 80"
        className="pointer-events-none absolute top-16 left-12 hidden h-16 w-16 text-white/10 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M31 12h18v19h19v18H49v19H31V49H12V31h19V12z"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="pointer-events-none absolute right-16 bottom-16 hidden h-14 w-14 text-white/10 lg:block"
        fill="currentColor"
      >
        <rect x="24" y="6" width="16" height="52" rx="4" />
        <rect x="6" y="24" width="52" height="16" rx="4" />
      </svg>

      {/* Kontainer Utama Sentral */}
      <div className="relative z-10 flex w-full max-w-[470px] flex-col items-center">
        {/* Header Brand & Tagline di Atas Kartu */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-5 py-2.5 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.4)] ring-4 ring-white/15">
            <Image
              src="/logo.png"
              alt="Portal Kesehatan Posyandu Banjar Agung"
              width={1024}
              height={682}
              priority
              unoptimized
              className="h-14 w-auto object-contain sm:h-16"
            />
          </div>

          <h2 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
            Layanan kesehatan, lebih dekat dan{" "}
            <span className="text-[#7ce2a7]">mudah.</span>
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-white/80 sm:text-[13px]">
            Akses jurnal kesehatan, jadwal dokter, dan kegiatan Posyandu Banjar Agung.
          </p>
        </div>

        {/* Bingkai Glassmorphic yang Membungkus Kartu Form */}
        <div className="w-full rounded-[32px] border border-white/20 bg-white/10 p-2 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-2.5">
          {children}
        </div>

        {/* 3 Lencana Fitur di Bawah Kartu */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {highlights.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-xs"
            >
              <Icon size={13} className="text-[#7ce2a7]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

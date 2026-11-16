import Image from "next/image";
import { BookOpen, CalendarCheck, Stethoscope } from "lucide-react";

/**
 * Layout halaman autentikasi yang lebih sentral, proporsional, dan menarik.
 */
export default function AuthLayout({ children }) {
  const highlights = [
    { icon: BookOpen, label: "Jurnal Kesehatan" },
    { icon: Stethoscope, label: "Jadwal Dokter" },
    { icon: CalendarCheck, label: "Kegiatan Posyandu" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#eef6f2] via-[#f6faf8] to-[#e2f0e9] lg:flex-row">
      {/* Ornamen latar area kanan */}
      <svg
        aria-hidden="true"
        viewBox="0 0 500 500"
        className="pointer-events-none absolute -bottom-28 -right-24 hidden h-[380px] w-[380px] text-[#cfe4da] lg:block"
        fill="currentColor"
      >
        <path d="M412,92 C480,150 510,270 480,380 C450,490 320,520 190,500 C60,480 10,410 50,320 C90,230 180,240 260,170 C340,100 344,34 412,92 Z" />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="pointer-events-none absolute top-12 right-14 hidden h-14 w-14 text-[#d5e6de] lg:block"
        fill="currentColor"
      >
        <rect x="24" y="6" width="16" height="52" rx="4" />
        <rect x="6" y="24" width="52" height="16" rx="4" />
      </svg>

      {/* Panel Kiri Hijau Tua — Konten Sentral & Seimbang */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#18603e] via-[#145336] to-[#0e3d27] px-6 py-12 text-center text-white shadow-2xl sm:px-12 lg:min-h-screen lg:w-[46%] lg:rounded-r-[40px] lg:px-14">
        {/* Cahaya lembut di belakang logo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ade80]/15 blur-3xl"
        />
        {/* Aksen lengkung hijau muda di kanan atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#26704d]/45"
        />
        {/* Aksen gelombang gelap di kiri bawah */}
        <div
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-96 rounded-[100%] bg-[#0b3320]/70"
        />

        {/* Ornamen tanda plus medis */}
        <svg
          aria-hidden="true"
          viewBox="0 0 80 80"
          className="pointer-events-none absolute bottom-10 right-12 hidden h-16 w-16 text-white/10 lg:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M31 12h18v19h19v18H49v19H31V49H12V31h19V12z"
          />
        </svg>

        <div className="relative z-10 flex max-w-md flex-col items-center">
          {/* Kartu Logo Putih Sentral */}
          <div className="inline-flex items-center justify-center overflow-hidden rounded-3xl bg-white px-6 py-3.5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)] ring-4 ring-white/15">
            <Image
              src="/logo.png"
              alt="Portal Kesehatan Posyandu Banjar Agung"
              width={1024}
              height={682}
              priority
              unoptimized
              className="h-20 w-auto object-contain sm:h-24"
            />
          </div>

          {/* Heading Utama (2 Baris Proporsional) */}
          <h2 className="mt-9 text-2xl font-extrabold leading-[1.25] tracking-tight sm:text-3xl lg:text-[34px]">
            Layanan kesehatan,
            <br />
            lebih dekat dan <span className="text-[#7ce2a7]">mudah.</span>
          </h2>

          {/* Subjudul */}
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-white/85 sm:text-[15px]">
            Akses jurnal kesehatan, jadwal dokter, dan jadwal kegiatan Posyandu Banjar Agung
            dalam satu tempat.
          </p>

          {/* 3 Badge Fitur agar Tampilan Lebih Menarik & Informatif */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {highlights.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white/95 backdrop-blur-xs"
              >
                <Icon size={14} className="text-[#7ce2a7]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Area Kanan (Kartu Form Login) */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        {children}
      </section>
    </div>
  );
}

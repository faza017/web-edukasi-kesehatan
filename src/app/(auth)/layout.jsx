import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Layout halaman autentikasi sesuai desain baru:
 * - Panel kiri hijau tua berlekuk organik dengan logo, "mudah." berwarna hijau muda,
 *   pill "→ Sehat Bersama", dan ornamen tanda plus medis.
 * - Area kanan berlatar terang dengan ornamen gelombang hijau lembut & tanda plus.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f2f7f4] lg:flex-row">
      {/* Ornamen latar area kanan (gelombang atas kiri, gelombang kanan bawah, & tanda plus) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 500 500"
        className="pointer-events-none absolute -bottom-28 -right-24 hidden h-[360px] w-[360px] text-[#cfe4da] lg:block"
        fill="currentColor"
      >
        <path d="M412,92 C480,150 510,270 480,380 C450,490 320,520 190,500 C60,480 10,410 50,320 C90,230 180,240 260,170 C340,100 344,34 412,92 Z" />
      </svg>

      {/* Ornamen tanda plus di kanan atas */}
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="pointer-events-none absolute top-14 right-14 hidden h-14 w-14 text-[#d8e8e0] lg:block"
        fill="currentColor"
      >
        <rect x="24" y="6" width="16" height="52" rx="4" />
        <rect x="6" y="24" width="52" height="16" rx="4" />
      </svg>

      {/* Panel Kiri Hijau Tua */}
      <section className="relative flex flex-col justify-center overflow-hidden bg-[#145336] px-6 py-10 text-white sm:px-12 lg:min-h-screen lg:w-[41%] lg:max-w-[500px] lg:px-14 lg:py-14">
        {/* Aksen lengkung hijau muda di sisi luar kanan atas panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-28 hidden h-80 w-80 rounded-full bg-[#246b49]/55 lg:block"
        />
        {/* Aksen gelombang gelap di kiri bawah panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-96 rounded-[100%] bg-[#0e3f28]/70"
        />

        {/* Ornamen tanda plus outline di bawah panel kiri */}
        <svg
          aria-hidden="true"
          viewBox="0 0 80 80"
          className="pointer-events-none absolute bottom-14 left-1/2 h-20 w-20 -translate-x-1/3 text-white/10"
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

        <div className="relative z-10 my-auto">
          {/* Kartu Logo Putih */}
          <div className="inline-flex items-center overflow-hidden rounded-2xl bg-white px-4 py-2.5 shadow-lg">
            <Image
              src="/logo.png"
              alt="Portal Kesehatan Puskesmas Banjar Agung"
              width={1024}
              height={682}
              priority
              unoptimized
              className="h-16 w-auto object-contain sm:h-20"
            />
          </div>

          {/* Heading Utama */}
          <h2 className="mt-10 text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-[38px]">
            Layanan kesehatan,
            <br />
            lebih dekat dan <span className="text-[#7ce2a7]">mudah.</span>
          </h2>

          {/* Subjudul */}
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85 sm:text-[15px]">
            Akses jurnal kesehatan dan jadwal dokter dalam satu tempat.
          </p>

          {/* Pill Sehat Bersama dengan ikon panah lingkaran */}
          <div className="mt-8">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#236647]/90 py-2 pr-5 pl-2.5 text-xs font-medium text-white/95 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <ArrowRight size={13} />
              </span>
              Sehat Bersama
            </span>
          </div>
        </div>
      </section>

      {/* Area Kanan (Kartu Form Login) */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        {children}
      </section>
    </div>
  );
}

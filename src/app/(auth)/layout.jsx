import Image from "next/image";

/**
 * Layout halaman autentikasi (Frame 01): panel gradasi kiri + kartu form kanan.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-[#f0f7f4] to-[#dceee6] lg:flex-row">
      <section className="relative flex flex-col justify-start overflow-hidden bg-gradient-to-b from-white via-[#e6f5ee] via-35% to-brand-900 px-6 py-8 text-white shadow-xl sm:px-10 lg:min-h-screen lg:w-[43%] lg:max-w-[520px] lg:rounded-r-3xl lg:px-11 lg:py-12">
        {/* Efek cahaya lembut agar transisi putih logo ke hijau semakin halus */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/80 blur-3xl"
        />

        <div className="relative z-10 inline-flex self-start overflow-hidden rounded-2xl bg-white/95 p-1 shadow-sm ring-1 ring-emerald-900/5">
          <Image
            src="/logo.png"
            alt="Portal Kesehatan Puskesmas Banjar Agung"
            width={1024}
            height={682}
            priority
            unoptimized
            className="h-24 w-auto object-contain sm:h-28 lg:h-32"
          />
        </div>

        <div className="relative z-10 mt-10 lg:mt-16">
          <h2 className="text-2xl font-extrabold leading-tight text-brand-900 drop-shadow-2xs sm:text-[30px] sm:leading-[1.25] lg:text-white lg:drop-shadow-sm">
            Layanan kesehatan,
            <br />
            lebih dekat dan mudah.
          </h2>
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-slate-700 lg:text-white/90">
            Akses jurnal kesehatan dan jadwal dokter dalam satu tempat.
          </p>
          <span className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 bg-brand-900/80 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-white shadow-xs backdrop-blur-xs">
            SEHAT BERSAMA
          </span>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        {children}
      </section>
    </div>
  );
}

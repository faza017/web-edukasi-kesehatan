import Image from "next/image";

/**
 * Layout halaman autentikasi (Frame 01): panel hijau kiri + kartu form kanan.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-page lg:flex-row">
      <section className="relative flex flex-col justify-start bg-brand-900 px-6 py-8 text-white sm:px-10 lg:min-h-screen lg:w-[43%] lg:max-w-[520px] lg:rounded-r-2xl lg:px-11 lg:py-12">
        <div className="inline-flex self-start overflow-hidden rounded-2xl bg-white shadow-md">
          <Image
            src="/logo.png"
            alt="Portal Kesehatan Puskesmas Banjar Agung"
            width={1024}
            height={682}
            priority
            unoptimized
            className="h-24 w-auto object-cover sm:h-28 lg:h-32"
          />
        </div>

        <div className="mt-8 lg:mt-14">
          <h2 className="text-2xl font-bold leading-tight sm:text-[30px] sm:leading-[1.25]">
            Layanan kesehatan,
            <br />
            lebih dekat dan mudah.
          </h2>
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-white/85">
            Akses jurnal kesehatan dan jadwal dokter dalam satu tempat.
          </p>
          <span className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-700 px-4 py-1.5 text-[11px] font-semibold tracking-wider">
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

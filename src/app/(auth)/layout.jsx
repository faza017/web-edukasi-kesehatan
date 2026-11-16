/**
 * Layout halaman autentikasi asli (Frame 01): panel hijau kiri + kartu form kanan.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-page lg:flex-row">
      <section className="relative flex flex-col bg-brand-900 px-6 py-8 text-white sm:px-10 lg:min-h-screen lg:w-[43%] lg:max-w-[520px] lg:rounded-r-2xl lg:px-10 lg:py-12">
        <div className="flex items-center gap-2.5 text-lg font-bold">
          <span className="text-xl font-black">✚</span> Posyandu Banjar Agung
        </div>

        <div className="mt-8 lg:mt-auto lg:mb-auto">
          <h2 className="text-2xl font-bold leading-tight sm:text-[28px] sm:leading-[1.3]">
            Layanan kesehatan,
            <br />
            lebih dekat dan mudah.
          </h2>
          <p className="mt-4 text-sm text-white/85">
            Akses jurnal kesehatan dan jadwal dokter dalam satu tempat.
          </p>
          <span className="mt-8 hidden w-36 rounded-full bg-brand-700 px-2.5 py-1.5 text-[10px] font-medium tracking-wide lg:inline-block">
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

import HealthCalculator from "@/components/HealthCalculator";

export const metadata = {
  title: "Kalkulator BMI & Hidrasi — SehatPedia",
  description:
    "Hitung Indeks Massa Tubuh (BMI) dan estimasi kebutuhan cairan harian Anda secara interaktif.",
};

export default function KalkulatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Alat Bantu Interaktif
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Kalkulator Kesehatan Harian
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Ketahui status Indeks Massa Tubuh (BMI) Anda berdasarkan standar
          WHO Asia-Pasifik dan hitung target konsumsi air putih harian.
        </p>
      </div>

      <HealthCalculator />
    </div>
  );
}


"use client";

import { useState } from "react";

export default function HealthCalculator() {
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(168);
  const [activity, setActivity] = useState("sedang");

  const heightInMeters = height / 100;
  const bmi =
    heightInMeters > 0
      ? (weight / (heightInMeters * heightInMeters)).toFixed(1)
      : 0;

  let bmiStatus = "Normal (Ideal)";
  let bmiColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let bmiAdvice =
    "Berat badan Anda sudah ideal. Pertahankan pola makan seimbang dan olahraga rutin minimal 150 menit per minggu.";

  const numericBmi = parseFloat(bmi);
  if (numericBmi < 18.5) {
    bmiStatus = "Kurang Berat Badan (Underweight)";
    bmiColor = "text-sky-700 bg-sky-50 border-sky-200";
    bmiAdvice =
      "Tingkatkan asupan kalori padat nutrisi secara bertahap dengan protein berkualitas dan latihan kekuatan otot.";
  } else if (numericBmi >= 23 && numericBmi < 25) {
    bmiStatus = "Berisiko Kelebihan Berat (Overweight - Kriteria Asia)";
    bmiColor = "text-amber-700 bg-amber-50 border-amber-200";
    bmiAdvice =
      "Mulai kurangi minuman manis dan gorengan, serta tambahkan jalan cepat 30 menit setiap hari.";
  } else if (numericBmi >= 25) {
    bmiStatus = "Obesitas (Kriteria Asia-Pasifik)";
    bmiColor = "text-rose-700 bg-rose-50 border-rose-200";
    bmiAdvice =
      "Disarankan mengatur defisit kalori terukur dan berkonsultasi dengan dokter atau ahli gizi untuk skrining metabolik.";
  }

  // Kebutuhan cairan harian (ml): ~35 ml per kg berat badan + tambahan aktivitas
  const activityBonus =
    activity === "tinggi" ? 500 : activity === "sedang" ? 250 : 0;
  const waterMl = Math.round(weight * 35 + activityBonus);
  const waterGlasses = (waterMl / 250).toFixed(1);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Parameter Tubuh Anda
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Geser atau masukkan angka berat dan tinggi badan untuk menghitung
          Indeks Massa Tubuh (standar Asia-Pasifik) serta kebutuhan air harian.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium">
              <label htmlFor="weight-input" className="text-slate-700">
                Berat Badan (kg)
              </label>
              <span className="font-bold text-emerald-600">{weight} kg</span>
            </div>
            <input
              id="weight-input"
              type="range"
              min="30"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium">
              <label htmlFor="height-input" className="text-slate-700">
                Tinggi Badan (cm)
              </label>
              <span className="font-bold text-emerald-600">{height} cm</span>
            </div>
            <input
              id="height-input"
              type="range"
              min="120"
              max="210"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tingkat Aktivitas Fisik Harian
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2.5">
              {[
                { id: "ringan", label: "Ringan" },
                { id: "sedang", label: "Sedang" },
                { id: "tinggi", label: "Aktif / Berat" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivity(item.id)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                    activity === item.id
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hasil Kalkulasi */}
      <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-6 shadow-xs sm:p-8">
        <div>
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Hasil Analisis Instan
          </span>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium text-slate-500">
                Skor BMI Anda
              </p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {bmi}
              </p>
              <span
                className={`mt-2 inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${bmiColor}`}
              >
                {bmiStatus}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium text-slate-500">
                Target Air Putih Harian
              </p>
              <p className="mt-1 text-3xl font-extrabold text-sky-600">
                {(waterMl / 1000).toFixed(1)} L
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Setara ± <strong>{waterGlasses} gelas</strong> (ukuran 250 ml)
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-900">
              Rekomendasi Edukasi:
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {bmiAdvice}
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          * Catatan: Klasifikasi BMI menggunakan standar WHO Asia-Pasifik (Normal:
          18.5 – 22.9 kg/m²).
        </p>
      </div>
    </div>
  );
}


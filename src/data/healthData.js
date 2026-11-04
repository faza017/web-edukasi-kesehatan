export const categories = [
  { id: "semua", name: "Semua Topik", icon: "✨", count: 6 },
  { id: "nutrisi", name: "Gizi & Nutrisi", icon: "🥗", count: 2 },
  { id: "mental", name: "Kesehatan Mental", icon: "🧠", count: 1 },
  { id: "olahraga", name: "Aktivitas Fisik", icon: "🏃", count: 1 },
  { id: "pencegahan", name: "Pencegahan Penyakit", icon: "🛡️", count: 2 },
];

export const articles = [
  {
    slug: "panduan-piring-makan-sehat-harian",
    title: "Panduan 'Isi Piringku': Cara Mudah Mengatur Porsi Makan Sehat Harian",
    excerpt:
      "Pelajari komposisi karbohidrat, protein, sayur, dan buah yang seimbang sesuai pedoman Kementerian Kesehatan untuk menjaga energi sepanjang hari.",
    category: "nutrisi",
    categoryLabel: "Gizi & Nutrisi",
    readTime: "5 menit baca",
    publishedAt: "4 Nov 2026",
    author: {
      name: "dr. Nadia Putri, Sp.GK",
      role: "Spesialis Gizi Klinik",
    },
    featured: true,
    highlights: [
      "Setengah piring diisi sayur dan buah-buahan segar.",
      "Seperempat piring diisi lauk pauk sumber protein nabati & hewani.",
      "Batasi konsumsi gula maksimal 4 sendok makan per hari.",
    ],
    content: [
      {
        heading: "Mengapa Konsep 'Isi Piringku' Penting?",
        body: "Banyak masyarakat masih beranggapan bahwa kenyang berarti sudah cukup gizi. Padahal, tubuh membutuhkan zat gizi makro (karbohidrat, protein, lemak sehat) dan mikro (vitamin serta mineral) dalam proporsi yang tepat agar fungsi organ berjalan optimal dan terhindar dari penyakit metabolik.",
      },
      {
        heading: "Pembagian Porsi dalam Satu Piring",
        body: "Bayangkan piring makan Anda dibagi menjadi dua bagian besar. Setengah bagian pertama wajib diisi oleh sayuran (2/3 bagian) dan buah-buahan (1/3 bagian). Setengah bagian kedua dibagi lagi untuk makanan pokok sumber karbohidrat kompleks (2/3 bagian) dan lauk-pauk sumber protein (1/3 bagian).",
      },
      {
        heading: "Tips Praktis Memulai Hari Ini",
        body: "Mulailah dengan menambahkan satu porsi sayur di setiap waktu makan utama, mengganti camilan manis dengan potongan buah segar, serta minum minimal 8 gelas air putih sehari.",
      },
    ],
  },
  {
    slug: "mengenal-burnout-dan-cara-mengatasinya",
    title: "Mengenal Burnout Akademik & Kerja: Gejala Awal dan Langkah Pemulihan",
    excerpt:
      "Kelelahan emosional yang berkepanjangan bukan sekadar rasa malas. Kenali tanda-tanda burnout dan teknik manajemen stres berbasis bukti medis.",
    category: "mental",
    categoryLabel: "Kesehatan Mental",
    readTime: "6 menit baca",
    publishedAt: "2 Nov 2026",
    author: {
      name: "Rizky Pratama, M.Psi., Psikolog",
      role: "Psikolog Klinis Dewasa",
    },
    featured: true,
    highlights: [
      "Kelelahan kronis yang tidak hilang meski sudah tidur di akhir pekan.",
      "Penurunan motivasi dan munculnya sikap sinis terhadap tugas harian.",
      "Teknik pernapasan 4-7-8 dan batasan digital membantu pemulihan saraf.",
    ],
    content: [
      {
        heading: "Perbedaan Stres Biasa dan Burnout",
        body: "Stres biasanya ditandai dengan keterlibatan berlebihan (over-engagement) dan rasa urgensi tinggi, sedangkan burnout ditandai dengan pelepasan emosional (disengagement), rasa hampa, dan hilangnya harapan bahwa usaha Anda akan membawa perubahan.",
      },
      {
        heading: "Langkah Mikro untuk Pemulihan",
        body: "Terapkan jeda istirahat singkat setiap 50 menit bekerja (teknik Pomodoro), tetapkan jam bebas gawai minimal 1 jam sebelum tidur, dan jangan ragu berkonsultasi dengan tenaga profesional bila gejala mengganggu kualitas tidur.",
      },
    ],
  },
  {
    slug: "olahraga-kardio-vs-latihan-beban",
    title: "Kardio vs Latihan Beban: Mana yang Lebih Efektif untuk Kesehatan Jantung?",
    excerpt:
      "Kombinasi latihan aerobik dan resistensi terbukti memberikan perlindungan ganda terhadap risiko penyakit kardiovaskular dan diabetes tipe 2.",
    category: "olahraga",
    categoryLabel: "Aktivitas Fisik",
    readTime: "4 menit baca",
    publishedAt: "30 Okt 2026",
    author: {
      name: "dr. Bagas Wijaya, Sp.KO",
      role: "Spesialis Kedokteran Olahraga",
    },
    featured: false,
    highlights: [
      "Targetkan 150 menit aktivitas aerobik intensitas sedang per minggu.",
      "Tambahkan 2 sesi latihan kekuatan otot untuk menjaga sensitivitas insulin.",
      "Jalan cepat 30 menit sehari sudah menurunkan risiko hipertensi secara signifikan.",
    ],
    content: [
      {
        heading: "Manfaat Sinergis Kardio dan Beban",
        body: "Latihan kardio seperti jalan cepat, bersepeda, atau berenang memperkuat otot jantung dan paru-paru. Sementara itu, latihan beban meningkatkan massa otot yang berfungsi sebagai penyimpan glukosa utama dalam tubuh.",
      },
      {
        heading: "Rekomendasi Mingguan WHO",
        body: "Organisasi Kesehatan Dunia (WHO) menyarankan orang dewasa melakukan 150–300 menit aktivitas fisik aerobik intensitas sedang setiap minggu, dikombinasikan dengan latihan penguatan otot minimal 2 hari per minggu.",
      },
    ],
  },
  {
    slug: "pencegahan-diabetes-usia-muda",
    title: "Waspada Prediabetes di Usia 20-an: Kenali Faktor Risiko Sejak Dini",
    excerpt:
      "Gaya hidup sedentari dan konsumsi minuman manis berlebih memicu lonjakan kasus resistensi insulin pada kelompok usia produktif.",
    category: "pencegahan",
    categoryLabel: "Pencegahan Penyakit",
    readTime: "7 menit baca",
    publishedAt: "28 Okt 2026",
    author: {
      name: "dr. Hendra Kusuma, Sp.PD",
      role: "Spesialis Penyakit Dalam",
    },
    featured: true,
    highlights: [
      "Prediabetes sering kali tidak menimbulkan gejala fisik yang nyata.",
      "Lingkar perut berlebih merupakan indikator kuat resistensi insulin.",
      "Perubahan pola makan dapat membalikkan kondisi prediabetes menjadi normal.",
    ],
    content: [
      {
        heading: "Mengapa Usia Muda Kini Rentan?",
        body: "Kebiasaan duduk terlalu lama di depan layar, kurang tidur, dan tingginya konsumsi minuman berpemanis (fruktose sirup tinggi) menyebabkan pankreas bekerja ekstra keras memproduksi insulin setiap hari.",
      },
      {
        heading: "Deteksi Dini Melalui Cek Gula Darah",
        body: "Lakukan pemeriksaan Gula Darah Puasa (GDP) dan HbA1c minimal satu tahun sekali, terutama bila Anda memiliki riwayat keluarga diabetes atau indeks massa tubuh di atas normal.",
      },
    ],
  },
  {
    slug: "pentingnya-hidrasi-untuk-fungsi-otak",
    title: "Dampak Dehidrasi Ringan terhadap Konsentrasi dan Suasana Hati",
    excerpt:
      "Kekurangan cairan tubuh sebesar 2% saja sudah dapat menurunkan daya ingat jangka pendek, memicu sakit kepala, dan menyebabkan kelelahan.",
    category: "nutrisi",
    categoryLabel: "Gizi & Nutrisi",
    readTime: "4 menit baca",
    publishedAt: "25 Okt 2026",
    author: {
      name: "dr. Nadia Putri, Sp.GK",
      role: "Spesialis Gizi Klinik",
    },
    featured: false,
    highlights: [
      "Otak manusia terdiri dari sekitar 75% air.",
      "Warna urine kuning jernih adalah indikator hidrasi yang baik.",
      "Jangan tunggu rasa haus muncul baru minum air.",
    ],
    content: [
      {
        heading: "Hubungan Cairan Tubuh dan Kognisi",
        body: "Air berperan penting dalam mengantarkan nutrisi ke sel-sel otak dan menjaga keseimbangan elektrolit untuk transmisi sinyal saraf. Saat tubuh kekurangan cairan, aliran darah ke otak sedikit melambat sehingga Anda mudah merasa mengantuk.",
      },
    ],
  },
  {
    slug: "higienitas-tidur-untuk-imunitas",
    title: "Sleep Hygiene: 5 Kebiasaan Malam Hari untuk Meningkatkan Imunitas Tubuh",
    excerpt:
      "Tidur berkualitas selama 7-8 jam adalah fondasi utama regenerasi sel imun dan pembentukan antibodi pelindung tubuh.",
    category: "pencegahan",
    categoryLabel: "Pencegahan Penyakit",
    readTime: "5 menit baca",
    publishedAt: "20 Okt 2026",
    author: {
      name: "dr. Hendra Kusuma, Sp.PD",
      role: "Spesialis Penyakit Dalam",
    },
    featured: false,
    highlights: [
      "Jaga suhu kamar tidur tetap sejuk (sekitar 20-23°C).",
      "Hindari konsumsi kafein minimal 6 jam sebelum waktu tidur.",
      "Bangun dan tidur di jam yang sama setiap hari termasuk akhir pekan.",
    ],
    content: [
      {
        heading: "Apa yang Terjadi Saat Kita Tidur?",
        body: "Selama fase tidur dalam (deep sleep), sistem kekebalan tubuh melepaskan protein yang disebut sitokin. Beberapa sitokin ini sangat dibutuhkan untuk melawan infeksi virus maupun bakteri serta meredakan peradangan.",
      },
    ],
  },
];

export const healthMyths = [
  {
    id: 1,
    myth: "Minum air es setelah makan menyebabkan lemak membeku di pembuluh darah.",
    fact: "MITOS. Suhu air yang masuk ke tubuh akan segera disesuaikan oleh suhu inti tubuh di saluran pencernaan dan tidak membekukan lemak di pembuluh darah.",
  },
  {
    id: 2,
    myth: "Makan malam setelah jam 7 malam pasti langsung bikin gemuk.",
    fact: "MITOS. Kenaikan berat badan ditentukan oleh total surplus kalori harian dan kualitas makanan, bukan semata-mata jam makan.",
  },
  {
    id: 3,
    myth: "Olahraga pagi dengan perut kosong membakar lebih banyak lemak.",
    fact: "FAKTA SEBAGIAN, namun bagi sebagian orang dapat menyebabkan hipoglikemia dan cepat lelah sehingga intensitas latihan justru menurun.",
  },
];


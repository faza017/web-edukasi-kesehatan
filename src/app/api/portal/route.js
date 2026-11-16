import { NextResponse } from "next/server";
import { getAllPortalData, writeLocalDb } from "@/lib/serverDb";
import { getServerSupabase } from "@/lib/supabase";
import { createSeed } from "@/data/seed";
import { poliDariLokasi } from "@/lib/selectors";
import { slugify } from "@/lib/utils";

/**
 * GET /api/portal
 * Mengambil seluruh data utama dari Supabase PostgreSQL.
 */
export async function GET() {
  try {
    const result = await getAllPortalData();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Gagal memuat data dari Supabase" },
      { status: 500 }
    );
  }
}

async function seedToSupabase(sb) {
  const seed = createSeed();

  await sb.from("users").upsert(
    seed.users.map((u) => ({
      id: u.id,
      nama: u.nama,
      email: u.email,
      password_hash: u.password,
      peran: u.peran,
    }))
  );

  await sb.from("kategori").upsert(seed.kategori);

  await sb.from("jurnal").upsert(
    seed.jurnal.map((j) => ({
      id: j.id,
      judul: j.judul,
      slug: j.slug,
      kategori_id: j.kategoriId,
      penulis: j.penulis,
      ringkasan: j.ringkasan,
      isi: j.isi,
      berkas: j.berkas,
      menit_baca: j.menitBaca,
      status: j.status,
      tanggal_terbit: j.tanggalTerbit,
      dibuat_oleh: "u-2",
    }))
  );

  const dokterRows = [
    { id: "d-1", nama: "dr. Andi Pratama", spesialisasi: "Dokter Umum", poli: "Poli Umum" },
    { id: "d-2", nama: "dr. Siti Rahma, Sp.KK", spesialisasi: "Spesialis Kulit", poli: "Poli Kulit" },
    { id: "d-3", nama: "drg. Maya Lestari", spesialisasi: "Dokter Gigi", poli: "Poli Gigi" },
  ];
  await sb.from("dokter").upsert(dokterRows);

  const dokterIdByName = new Map(dokterRows.map((d) => [d.nama.toLowerCase(), d.id]));
  await sb.from("jadwal_dokter").upsert(
    seed.jadwalDokter.map((jd) => ({
      id: jd.id,
      dokter_id: dokterIdByName.get(jd.dokterNama.toLowerCase()) || null,
      dokter_nama: jd.dokterNama,
      spesialisasi: jd.spesialisasi,
      hari: jd.hari,
      tanggal: jd.tanggal,
      jam_mulai: jd.jamMulai,
      jam_selesai: jd.jamSelesai,
      lokasi: jd.lokasi,
      kuota: jd.kuota,
      status: jd.status,
    }))
  );

  await sb.from("kegiatan").upsert(
    seed.kegiatan.map((k) => ({
      id: k.id,
      nama: k.nama,
      jenis: k.jenis,
      penyelenggara: k.penyelenggara,
      tanggal: k.tanggal,
      waktu_mulai: k.waktuMulai,
      waktu_selesai: k.waktuSelesai,
      lokasi: k.lokasi,
      kuota: k.kuota,
      deskripsi: k.deskripsi,
    }))
  );

  await sb.from("pengaturan").upsert(
    Object.entries(seed.pengaturan).map(([kunci, nilai]) => ({
      kunci,
      nilai: String(nilai),
    }))
  );
}

/**
 * POST /api/portal
 * Menyimpan mutasi CRUD ke tabel-tabel Supabase PostgreSQL.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const sb = getServerSupabase();

    if (body.snapshot) {
      writeLocalDb(body.snapshot);
    }

    if (sb && action) {
      let dbError = null;

      switch (action) {
        case "jurnal:upsert": {
          const { error } = await sb.from("jurnal").upsert({
            id: payload.id,
            judul: payload.judul,
            slug: payload.slug,
            kategori_id: payload.kategoriId,
            penulis: payload.penulis,
            ringkasan: payload.ringkasan,
            isi: payload.isi,
            berkas: payload.berkas,
            menit_baca: payload.menitBaca,
            status: payload.status,
            tanggal_terbit: payload.tanggalTerbit,
            dibuat_oleh: payload.dibuatOleh || "u-2",
          });
          dbError = error;
          break;
        }
        case "jurnal:delete": {
          const { error } = await sb.from("jurnal").delete().eq("id", payload.id);
          dbError = error;
          break;
        }
        case "kategori:create": {
          const { error } = await sb.from("kategori").upsert({
            id: payload.id,
            nama: payload.nama,
            slug: payload.slug,
          });
          dbError = error;
          break;
        }
        case "kategori:delete": {
          const { error } = await sb.from("kategori").delete().eq("id", payload.id);
          dbError = error;
          break;
        }
        case "jadwal:upsert": {
          // Pastikan dokter terdaftar di tabel master `dokter` (PRD KD-5)
          const dokterId = `d-${slugify(payload.dokterNama) || "dokter"}`;
          const poli = poliDariLokasi(payload.lokasi) || "Poli Umum";
          await sb.from("dokter").upsert({
            id: dokterId,
            nama: payload.dokterNama,
            spesialisasi: payload.spesialisasi,
            poli,
          });

          const { error } = await sb.from("jadwal_dokter").upsert({
            id: payload.id,
            dokter_id: dokterId,
            dokter_nama: payload.dokterNama,
            spesialisasi: payload.spesialisasi,
            hari: payload.hari,
            tanggal: payload.tanggal,
            jam_mulai: payload.jamMulai,
            jam_selesai: payload.jamSelesai,
            lokasi: payload.lokasi,
            kuota: payload.kuota,
            status: payload.status,
          });
          dbError = error;
          break;
        }
        case "jadwal:delete": {
          const { error } = await sb.from("jadwal_dokter").delete().eq("id", payload.id);
          dbError = error;
          break;
        }
        case "kegiatan:upsert": {
          const { error } = await sb.from("kegiatan").upsert({
            id: payload.id,
            nama: payload.nama,
            jenis: payload.jenis,
            penyelenggara: payload.penyelenggara,
            tanggal: payload.tanggal,
            waktu_mulai: payload.waktuMulai,
            waktu_selesai: payload.waktuSelesai,
            lokasi: payload.lokasi,
            kuota: payload.kuota,
            deskripsi: payload.deskripsi,
          });
          dbError = error;
          break;
        }
        case "kegiatan:delete": {
          const { error } = await sb.from("kegiatan").delete().eq("id", payload.id);
          dbError = error;
          break;
        }
        case "pengaturan:update": {
          const rows = Object.entries(payload).map(([kunci, nilai]) => ({
            kunci,
            nilai: String(nilai),
          }));
          const { error } = await sb.from("pengaturan").upsert(rows);
          dbError = error;
          break;
        }
        case "reset": {
          writeLocalDb(createSeed());
          await seedToSupabase(sb);
          break;
        }
        default:
          break;
      }

      if (dbError) {
        return NextResponse.json(
          { ok: false, error: dbError.message },
          { status: 400 }
        );
      }
    }

    const latest = await getAllPortalData();
    return NextResponse.json({
      ok: true,
      mode: latest.mode,
      data: latest.data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Gagal menyimpan perubahan ke Supabase" },
      { status: 500 }
    );
  }
}

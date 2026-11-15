import { NextResponse } from "next/server";
import { getAllPortalData, readLocalDb, writeLocalDb } from "@/lib/serverDb";
import { getServerSupabase } from "@/lib/supabase";
import { createSeed } from "@/data/seed";

/**
 * GET /api/portal
 * Mengambil seluruh data portal dari Supabase PostgreSQL (atau fallback server DB).
 */
export async function GET() {
  try {
    const result = await getAllPortalData();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Gagal memuat data portal" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal
 * Menerima mutasi CRUD dari client dan menyinkronkannya ke Supabase PostgreSQL & server DB.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const sb = getServerSupabase();

    // Simpan juga ke file server lokal agar selalu sinkron
    if (body.snapshot) {
      writeLocalDb(body.snapshot);
    }

    if (sb && action) {
      switch (action) {
        case "jurnal:upsert": {
          await sb.from("jurnal").upsert({
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
          });
          break;
        }
        case "jurnal:delete": {
          await sb.from("jurnal").delete().eq("id", payload.id);
          break;
        }
        case "kategori:create": {
          await sb.from("kategori").upsert({
            id: payload.id,
            nama: payload.nama,
            slug: payload.slug,
          });
          break;
        }
        case "kategori:delete": {
          await sb.from("kategori").delete().eq("id", payload.id);
          break;
        }
        case "jadwal:upsert": {
          await sb.from("jadwal_dokter").upsert({
            id: payload.id,
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
          break;
        }
        case "jadwal:delete": {
          await sb.from("jadwal_dokter").delete().eq("id", payload.id);
          break;
        }
        case "kegiatan:upsert": {
          await sb.from("kegiatan").upsert({
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
          break;
        }
        case "kegiatan:delete": {
          await sb.from("kegiatan").delete().eq("id", payload.id);
          break;
        }
        case "pengaturan:update": {
          const rows = Object.entries(payload).map(([kunci, nilai]) => ({
            kunci,
            nilai: String(nilai),
          }));
          await sb.from("pengaturan").upsert(rows);
          break;
        }
        case "reset": {
          writeLocalDb(createSeed());
          break;
        }
        default:
          break;
      }
    }

    return NextResponse.json({
      ok: true,
      mode: sb ? "supabase-cloud" : "local-server",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Gagal menyimpan perubahan ke server" },
      { status: 500 }
    );
  }
}


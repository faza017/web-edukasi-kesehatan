import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * POST /api/upload
 * Unggah berkas jurnal (PDF, DOCX, JPG) ke Supabase Storage bucket `jurnal-berkas`.
 * Jika Supabase belum dikonfigurasi, mengembalikan Data URL agar tetap berfungsi di lokal.
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const sb = getServerSupabase();
    if (sb) {
      const { error } = await sb.storage
        .from("jurnal-berkas")
        .upload(safeName, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (!error) {
        const { data: pub } = sb.storage.from("jurnal-berkas").getPublicUrl(safeName);
        return NextResponse.json({
          ok: true,
          mode: "supabase-storage",
          berkas: {
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: pub.publicUrl,
          },
        });
      }
    }

    // Fallback: encode base64 Data URL dari server
    const base64 = buffer.toString("base64");
    const mime = file.type || "application/octet-stream";
    return NextResponse.json({
      ok: true,
      mode: "server-inline",
      berkas: {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: `data:${mime};base64,${base64}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Gagal mengunggah berkas." },
      { status: 500 }
    );
  }
}


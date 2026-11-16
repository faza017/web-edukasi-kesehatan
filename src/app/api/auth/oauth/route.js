import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * POST /api/auth/oauth
 * Menyinkronkan pengguna yang masuk lewat Google OAuth / Supabase Auth
 * ke tabel `public.users` agar nama dan perannya tercatat di database.
 */
export async function POST(request) {
  try {
    const { id, email, nama } = await request.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return NextResponse.json({ ok: false, error: "Email tidak ditemukan." }, { status: 400 });
    }

    const sb = getServerSupabase();
    if (sb) {
      const { data: existing } = await sb
        .from("users")
        .select("id, nama, email, peran")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ ok: true, user: existing });
      }

      const newUser = {
        id: id || `u-${Date.now()}`,
        nama: nama || cleanEmail.split("@")[0],
        email: cleanEmail,
        password_hash: "GOOGLE_OAUTH",
        peran: "pengguna",
      };

      await sb.from("users").upsert(newUser);

      return NextResponse.json({
        ok: true,
        user: {
          id: newUser.id,
          nama: newUser.nama,
          email: newUser.email,
          peran: newUser.peran,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: id || `u-${Date.now()}`,
        nama: nama || cleanEmail.split("@")[0],
        email: cleanEmail,
        peran: "pengguna",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Gagal menyinkronkan akun Google." },
      { status: 500 }
    );
  }
}


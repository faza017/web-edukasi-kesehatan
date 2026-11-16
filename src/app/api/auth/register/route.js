import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { readLocalDb, writeLocalDb } from "@/lib/serverDb";
import { uid } from "@/lib/utils";

/**
 * POST /api/auth/register
 * Mendaftarkan pengguna baru dengan email asli ke Supabase Auth & tabel `public.users`.
 */
export async function POST(request) {
  try {
    const { nama, email, password } = await request.json();
    const cleanNama = (nama || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanNama || !cleanEmail || !password) {
      return NextResponse.json(
        { ok: false, error: "Nama lengkap, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const sb = getServerSupabase();
    if (sb) {
      // 1. Cek apakah email sudah ada di public.users
      const { data: existing } = await sb
        .from("users")
        .select("id")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { ok: false, error: "Email ini sudah terdaftar. Silakan langsung masuk." },
          { status: 409 }
        );
      }

      // 2. Daftarkan juga ke Supabase Auth (auto-confirm agar langsung bisa login)
      const { data: authData, error: authErr } = await sb.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: cleanNama, peran: "pengguna" },
      });

      if (authErr && !authErr.message?.toLowerCase().includes("already")) {
        return NextResponse.json(
          { ok: false, error: authErr.message },
          { status: 400 }
        );
      }

      const newId = authData?.user?.id || uid("u");

      // 3. Simpan profil ke tabel public.users
      const { error: insertErr } = await sb.from("users").upsert({
        id: newId,
        nama: cleanNama,
        email: cleanEmail,
        password_hash: password,
        peran: "pengguna",
      });

      if (insertErr) {
        return NextResponse.json(
          { ok: false, error: insertErr.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        mode: "supabase-cloud",
        user: {
          id: newId,
          nama: cleanNama,
          email: cleanEmail,
          peran: "pengguna",
        },
      });
    }

    // Fallback ke local server DB
    const db = readLocalDb();
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json(
        { ok: false, error: "Email ini sudah terdaftar." },
        { status: 409 }
      );
    }

    const newUser = {
      id: uid("u"),
      nama: cleanNama,
      email: cleanEmail,
      password,
      peran: "pengguna",
    };
    db.users.push(newUser);
    writeLocalDb(db);

    return NextResponse.json({
      ok: true,
      mode: "local-server",
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        peran: newUser.peran,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Gagal mendaftarkan akun." },
      { status: 500 }
    );
  }
}


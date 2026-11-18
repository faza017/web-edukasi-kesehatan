import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { readLocalDb } from "@/lib/serverDb";

/**
 * POST /api/auth/login
 * Endpoint autentikasi backend (Supabase Auth + Tabel `public.users` PostgreSQL).
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { ok: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const sb = getServerSupabase();
    if (sb) {
      // 1. Cek di tabel public.users (dukung admin@posyandu.id maupun admin@puskesmas.id)
      const isAdminAlias =
        cleanEmail === "admin@posyandu.id" || cleanEmail === "admin@puskesmas.id";
      const query = sb
        .from("users")
        .select("id, nama, email, password_hash, peran");

      const { data: userRow, error } = await (isAdminAlias
        ? query.in("email", ["admin@posyandu.id", "admin@puskesmas.id"]).limit(1).maybeSingle()
        : query.ilike("email", cleanEmail).maybeSingle());

      if (!error && userRow) {
        if (userRow.password_hash === "GOOGLE_OAUTH") {
          return NextResponse.json(
            {
              ok: false,
              error: "Email ini terdaftar menggunakan Google. Silakan klik tombol 'Masuk dengan Google'.",
            },
            { status: 401 }
          );
        }

        if (userRow.password_hash !== password) {
          return NextResponse.json(
            { ok: false, error: "Email atau password salah." },
            { status: 401 }
          );
        }

        return NextResponse.json({
          ok: true,
          mode: "supabase-cloud",
          user: {
            id: userRow.id,
            nama: userRow.nama,
            email: userRow.email,
            peran: userRow.peran,
          },
        });
      }

      // 2. Jika belum ada di public.users tapi terdaftar di Supabase Auth, verifikasi via Supabase Auth
      const { data: authSign, error: signErr } = await sb.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!signErr && authSign?.user) {
        const nama =
          authSign.user.user_metadata?.full_name ||
          authSign.user.user_metadata?.name ||
          cleanEmail.split("@")[0];
        const peran = authSign.user.user_metadata?.peran || "pengguna";

        await sb.from("users").upsert({
          id: authSign.user.id,
          nama,
          email: cleanEmail,
          password_hash: password,
          peran,
        });

        return NextResponse.json({
          ok: true,
          mode: "supabase-cloud",
          user: {
            id: authSign.user.id,
            nama,
            email: cleanEmail,
            peran,
          },
        });
      }

      return NextResponse.json(
        {
          ok: false,
          error: "Akun belum terdaftar atau password salah. Silakan daftar akun terlebih dahulu atau masuk dengan Google.",
        },
        { status: 401 }
      );
    }

    // Fallback ke database server lokal
    const db = readLocalDb();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { ok: false, error: "Email atau password salah." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "local-server",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        peran: user.peran,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Terjadi kesalahan pada server autentikasi." },
      { status: 500 }
    );
  }
}

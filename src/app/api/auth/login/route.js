import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { readLocalDb } from "@/lib/serverDb";

/**
 * POST /api/auth/login
 * Endpoint autentikasi backend (Supabase Auth / Tabel Users PostgreSQL / Fallback Server).
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
      const { data: userRow, error } = await sb
        .from("users")
        .select("id, nama, email, password_hash, peran")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (!error && userRow) {
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


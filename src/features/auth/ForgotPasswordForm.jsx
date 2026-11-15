"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { requestPasswordReset } from "@/services/authService";
import { isValidEmail } from "@/lib/utils";

/** Lupa password (PRD AUTH-4). Versi mock: hanya menampilkan pesan sukses. */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email wajib diisi.");
    if (!isValidEmail(email)) return setError("Format email tidak valid.");
    requestPasswordReset(email);
    setSent(true);
  };

  return (
    <div className="w-full max-w-[520px] rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
      {sent ? (
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <MailCheck size={22} />
          </span>
          <h1 className="mt-4 text-xl font-bold text-brand-900">Periksa email Anda</h1>
          <p className="mt-2 text-[13px] text-muted">
            Jika <strong>{email}</strong> terdaftar, tautan untuk mengatur ulang password telah dikirim.
          </p>
          <Button href="/login" variant="outline" className="mt-6">
            <ArrowLeft size={16} /> Kembali ke halaman masuk
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-brand-900">Lupa password?</h1>
          <p className="mt-2 text-[13px] text-muted">
            Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang password.
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <Field label="Email" htmlFor="email" error={error}>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                error={error}
              />
            </Field>
            <Button type="submit" className="w-full">
              Kirim tautan reset
            </Button>
          </form>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
          >
            <ArrowLeft size={14} /> Kembali ke halaman masuk
          </Link>
        </>
      )}
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import {
  ROLE_HOME,
  login,
  loginWithGoogle,
  register,
  useAuth,
} from "@/services/authService";
import { isValidEmail } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
      />
    </svg>
  );
}

/** Frame 01 — Login & Registrasi Email Asli / Google OAuth (PRD AUTH-1 s/d AUTH-7). */
export default function LoginForm() {
  const router = useRouter();
  const { ready, user } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [values, setValues] = useState({ nama: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(() => {
    if (typeof window === "undefined") return "";
    const errDesc = new URLSearchParams(window.location.search).get("error_description");
    return errDesc ? `Google OAuth gagal: ${errDesc}` : "";
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Sudah login -> langsung ke halaman sesuai peran.
  useEffect(() => {
    if (ready && user) router.replace(ROLE_HOME[user.peran]);
  }, [ready, user, router]);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setFormError("");
  };

  const validate = () => {
    const next = {};
    if (mode === "register" && !values.nama.trim()) {
      next.nama = "Nama lengkap wajib diisi.";
    }
    if (!values.email.trim()) next.email = "Email wajib diisi.";
    else if (!isValidEmail(values.email)) next.email = "Format email tidak valid.";
    if (!values.password) next.password = "Password wajib diisi.";
    else if (mode === "register" && values.password.length < 6) {
      next.password = "Password minimal 6 karakter.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const redirectAfterAuth = (authUser) => {
    const nextParam = new URLSearchParams(window.location.search).get("next");
    const allowed =
      nextParam &&
      nextParam.startsWith("/") &&
      !nextParam.startsWith("//") &&
      (authUser.peran === "admin" || !nextParam.startsWith("/admin"));
    router.replace(allowed ? nextParam : ROLE_HOME[authUser.peran]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res =
      mode === "register"
        ? await register(values)
        : await login(values.email, values.password);
    setSubmitting(false);

    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    redirectAfterAuth(res.user);
  };

  const onGoogleClick = async () => {
    setFormError("");
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    if (!res.ok) {
      setGoogleLoading(false);
      setFormError(res.error);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setFormError("");
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
        <h1 className="text-2xl font-bold text-brand-900">
          {mode === "register" ? "Daftar akun baru" : "Selamat datang kembali"}
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          {mode === "register"
            ? "Gunakan email aktif atau akun Google Anda untuk mengakses portal."
            : "Masuk untuk melanjutkan ke akun Anda."}
        </p>

        {/* Tombol Masuk / Daftar dengan Google */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onGoogleClick}
            disabled={googleLoading || submitting}
            className="flex h-[42px] w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-white px-4 text-xs font-semibold text-brand-900 transition-colors hover:bg-brand-50 disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Menghubungkan ke Google..." : "Lanjutkan dengan Akun Google"}
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[11px] text-muted">atau dengan email</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {mode === "register" && (
            <Field label="Nama Lengkap" htmlFor="nama" error={errors.nama}>
              <Input
                id="nama"
                name="nama"
                type="text"
                autoComplete="name"
                placeholder="Masukkan nama lengkap Anda"
                value={values.nama}
                onChange={onChange}
                error={errors.nama}
                aria-describedby={errors.nama ? "nama-error" : undefined}
              />
            </Field>
          )}

          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@gmail.com"
              value={values.email}
              onChange={onChange}
              error={errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>

          <Field label="Password" htmlFor="password" error={errors.password}>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder={mode === "register" ? "Minimal 6 karakter" : "Masukkan password"}
                value={values.password}
                onChange={onChange}
                error={errors.password}
                className="pr-11"
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-brand-900"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {mode === "login" && (
            <div className="flex justify-end">
              <Link
                href="/lupa-password"
                className="text-[11px] font-medium text-brand-700 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
          )}

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              {formError}
            </p>
          )}

          <div className="flex justify-center pt-1">
            <Button type="submit" className="w-full sm:w-40" disabled={submitting}>
              {submitting
                ? "Memproses..."
                : mode === "register"
                  ? "Daftar Akun"
                  : "Masuk"}
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-line pt-4 text-center text-xs text-muted">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-semibold text-brand-700 hover:underline"
              >
                Daftar dengan email Anda
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-brand-700 hover:underline"
              >
                Masuk di sini
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

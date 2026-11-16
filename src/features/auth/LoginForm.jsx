"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
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

function ShieldCrossIcon() {
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" fill="none" aria-hidden="true">
      <path
        d="M24 2L6 9.5V24.5C6 36.4 13.7 46.9 24 50C34.3 46.9 42 36.4 42 24.5V9.5L24 2Z"
        fill="#165B3C"
      />
      <rect x="21" y="15" width="6" height="20" rx="2" fill="#FFFFFF" />
      <rect x="14" y="22" width="20" height="6" rx="2" fill="#FFFFFF" />
    </svg>
  );
}

/** Frame 01 — Login & Registrasi sesuai desain terbaru. */
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
    <div className="w-full">
      <div className="rounded-[24px] bg-white px-6 py-8 text-slate-800 shadow-sm sm:px-9 sm:py-9">
        {/* Ikon Perisai Medis & Judul */}
        <div className="flex flex-col items-center text-center">
          <ShieldCrossIcon />
          <h1 className="mt-3.5 text-2xl font-bold text-[#145336] sm:text-[26px]">
            {mode === "register" ? "Daftar akun baru" : "Selamat datang kembali"}
          </h1>
          <p className="mt-1.5 text-xs text-muted sm:text-[13px]">
            {mode === "register"
              ? "Gunakan email aktif atau akun Google Anda."
              : "Masuk untuk melanjutkan ke akun Anda."}
          </p>
        </div>

        {/* Tombol Lanjutkan dengan Google */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onGoogleClick}
            disabled={googleLoading || submitting}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-brand-50/60 disabled:opacity-60 sm:text-[13px]"
          >
            <GoogleIcon />
            {googleLoading ? "Menghubungkan ke Google..." : "Lanjutkan dengan Google"}
          </button>
        </div>

        {/* Pemisah "atau" */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[11px] text-muted">atau</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="nama" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted">
                  <User size={16} />
                </span>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  autoComplete="name"
                  placeholder="Masukkan nama lengkap"
                  value={values.nama}
                  onChange={onChange}
                  className={`h-11 w-full rounded-xl border bg-[#f9fbfa] pr-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-700 focus:bg-white focus:outline-none ${
                    errors.nama ? "border-red-400" : "border-line"
                  }`}
                />
              </div>
              {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted">
                <Mail size={16} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={values.email}
                onChange={onChange}
                className={`h-11 w-full rounded-xl border bg-[#f9fbfa] pr-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-700 focus:bg-white focus:outline-none ${
                  errors.email ? "border-red-400" : "border-line"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted">
                <Lock size={16} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder={mode === "register" ? "Minimal 6 karakter" : "Masukkan password"}
                value={values.password}
                onChange={onChange}
                className={`h-11 w-full rounded-xl border bg-[#f9fbfa] pr-11 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-700 focus:bg-white focus:outline-none ${
                  errors.password ? "border-red-400" : "border-line"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-brand-900"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {mode === "login" && (
            <div className="flex justify-end">
              <Link
                href="/lupa-password"
                className="text-xs font-semibold text-[#165B3C] hover:underline"
              >
                Lupa password?
              </Link>
            </div>
          )}

          {formError && (
            <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-[#165B3C] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#114930] disabled:opacity-60"
          >
            {submitting
              ? "Memproses..."
              : mode === "register"
                ? "Daftar Akun"
                : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-semibold text-[#165B3C] hover:underline"
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
                className="font-semibold text-[#165B3C] hover:underline"
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { DEMO_ACCOUNTS } from "@/data/seed";
import { ROLE_HOME, login, useAuth } from "@/services/authService";
import { isValidEmail } from "@/lib/utils";

/** Frame 01 — Login (PRD AUTH-1, AUTH-2, AUTH-3, AUTH-7). */
export default function LoginForm() {
  const router = useRouter();
  const { ready, user } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    if (!values.email.trim()) next.email = "Email wajib diisi.";
    else if (!isValidEmail(values.email)) next.email = "Format email tidak valid.";
    if (!values.password) next.password = "Password wajib diisi.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res = await login(values.email, values.password);
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    const nextParam = new URLSearchParams(window.location.search).get("next");
    const allowed =
      nextParam &&
      nextParam.startsWith("/") &&
      !nextParam.startsWith("//") &&
      (res.user.peran === "admin" || !nextParam.startsWith("/admin"));
    router.replace(allowed ? nextParam : ROLE_HOME[res.user.peran]);
  };

  const fillDemo = (acc) => {
    setValues({ email: acc.email, password: acc.password });
    setErrors({});
    setFormError("");
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
        <h1 className="text-2xl font-bold text-brand-900">Selamat datang kembali</h1>
        <p className="mt-2 text-[13px] text-muted">Masuk untuk melanjutkan ke akun Anda.</p>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
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
                autoComplete="current-password"
                placeholder="Masukkan password"
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

          <div className="flex justify-end">
            <Link href="/lupa-password" className="text-[11px] font-medium text-brand-700 hover:underline">
              Lupa password?
            </Link>
          </div>

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              {formError}
            </p>
          )}

          <div className="flex justify-center">
            <Button type="submit" className="w-full sm:w-32" disabled={submitting}>
              {submitting ? "Memproses..." : "Masuk"}
            </Button>
          </div>
        </form>
      </div>

      {/* Bantuan akun demo — hapus saat backend asli sudah terpasang */}
      <div className="mt-4 rounded-xl border border-line bg-white/70 p-4 text-xs text-muted">
        <p className="flex items-center gap-1.5 font-semibold text-brand-900">
          <Info size={14} /> Akun demo (klik untuk mengisi)
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => fillDemo(acc)}
              className="rounded-lg border border-line bg-white px-3 py-2 text-left hover:border-brand-700"
            >
              <span className="block font-semibold text-brand-900">{acc.label}</span>
              <span className="block">{acc.email}</span>
              <span className="block">{acc.password}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


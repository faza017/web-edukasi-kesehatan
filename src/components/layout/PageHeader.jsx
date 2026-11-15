"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, MonitorSmartphone } from "lucide-react";
import { useShell } from "@/components/layout/AppShell";
import { ROLE_LABEL, logout } from "@/services/authService";
import { formatLong, todayISO } from "@/lib/date";

/**
 * Header halaman: judul + deskripsi di kiri, info akun & tanggal di kanan.
 * Menu profil berisi tombol Keluar (PRD AUTH-5).
 */
export default function PageHeader({ title, subtitle, children }) {
  const { variant, user, ready } = useShell();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const todayLabel = ready ? formatLong(todayISO()) : "";

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !menuRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const displayName = user?.nama || "Pengguna";
  const displayRole = ROLE_LABEL[user?.peran || "pengguna"];

  return (
    <div className="mb-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-900 sm:text-[28px] sm:leading-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-[13px] text-muted">{subtitle}</p>}
        {children}
      </div>

      <div className="relative shrink-0 self-end sm:self-auto sm:text-right" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="group flex flex-col items-end gap-2 rounded-lg text-right"
        >
          {variant === "admin" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-[10px] font-semibold tracking-wide text-brand-900">
              ADMINISTRATOR <ChevronDown size={12} />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900">
              {displayName} <span className="text-[8px]">●</span> {displayRole}
              <ChevronDown size={12} className="text-muted" />
            </span>
          )}
          <span className="text-[10px] text-muted">{todayLabel || "\u00A0"}</span>
        </button>

        {open && user && (
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white text-left shadow-lg"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="truncate text-sm font-semibold text-brand-900">{user.nama}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            {user.peran === "admin" && (
              <Link
                role="menuitem"
                href={variant === "admin" ? "/beranda" : "/admin"}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
              >
                {variant === "admin" ? <MonitorSmartphone size={16} /> : <LayoutDashboard size={16} />}
                {variant === "admin" ? "Lihat portal pengguna" : "Buka panel admin"}
              </Link>
            )}
            <button
              role="menuitem"
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

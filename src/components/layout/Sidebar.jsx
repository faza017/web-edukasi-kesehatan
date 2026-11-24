"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CalendarDays,
  FileText,
  House,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = {
  pengguna: {
    label: "PORTAL KESEHATAN",
    items: [
      { href: "/beranda", label: "Beranda", icon: House },
      { href: "/jurnal", label: "Jurnal Kesehatan", icon: FileText },
      { href: "/jadwal-dokter", label: "Jadwal Dokter", icon: CalendarDays },
      { href: "/jadwal-kegiatan", label: "Jadwal Kegiatan", icon: CalendarClock },
    ],
  },
  admin: {
    label: "PANEL ADMIN",
    items: [
      { href: "/admin", label: "Dashboard admin", icon: House, exact: true },
      { href: "/admin/jurnal", label: "Kelola jurnal", icon: FileText },
      { href: "/admin/jadwal-dokter", label: "Kelola jadwal", icon: CalendarDays },
      { href: "/admin/kegiatan", label: "Kelola kegiatan", icon: CalendarClock },
      { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
    ],
  },
};

export function Brand({ subtitle, className }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5 text-white">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo Lampung Selatan"
            className="h-full w-auto object-contain"
          />
        </span>
        <span className="text-sm font-bold leading-tight">
          Posyandu
          <br />
          Banjar Agung
        </span>
      </div>
      {subtitle && (
        <p className="mt-3 text-[10px] font-semibold tracking-wide text-white/80">{subtitle}</p>
      )}
    </div>
  );
}

/** Sidebar hijau tua lebar 210px (PRD 9 — Layout). */
export default function Sidebar({ variant = "pengguna", onNavigate, onClose, className }) {
  const pathname = usePathname();
  const nav = NAV[variant];

  return (
    <aside
      className={cn(
        "flex h-full w-[210px] flex-col bg-gradient-to-b from-[#db2777] via-[#be185d] to-[#831843] text-white shadow-lg",
        className
      )}
    >
      <div className="flex items-start justify-between px-6 pt-5">
        <Brand subtitle={nav.label} />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-white/80 hover:bg-white/10"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="mt-7 flex-1 space-y-3 px-3.5" aria-label="Navigasi utama">
        {nav.items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex h-[42px] items-center gap-3 rounded-xl px-3.5 text-[13px] transition-all duration-200 ease-out active:scale-[0.97]",
                active
                  ? "bg-white font-bold text-[#be185d] shadow-md shadow-black/10"
                  : "text-white/90 hover:translate-x-1 hover:bg-white/15 hover:text-white"
              )}
            >
              <Icon
                size={16}
                strokeWidth={1.9}
                className={cn(
                  "transition-transform duration-200 group-hover:scale-110",
                  active && "scale-110 text-[#ec4899]"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


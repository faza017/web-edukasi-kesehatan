"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CalendarDays,
  FileText,
  House,
  Phone,
  Settings,
  X,
} from "lucide-react";
import { useData } from "@/services/dataService";
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
      <div className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Portal Kesehatan Puskesmas Banjar Agung"
          className="h-9 w-auto object-contain"
        />
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
  const data = useData();
  const nav = NAV[variant];
  const wa = data?.pengaturan?.kontakWhatsapp;
  const telp = data?.pengaturan?.kontakTelepon;

  return (
    <aside className={cn("flex h-full w-[210px] flex-col bg-brand-900 text-white", className)}>
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
                "flex h-[42px] items-center gap-3 rounded-lg px-3.5 text-[13px] transition-colors",
                active ? "bg-brand-700 font-semibold text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-5 border-t border-white/15 py-5">
        <p className="text-xs font-semibold">Butuh bantuan?</p>
        <a
          href={wa ? `https://wa.me/${wa}` : "#"}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 block text-[10px] text-white/80 hover:text-white hover:underline"
        >
          Hubungi layanan kami
        </a>
        {telp && (
          <p className="mt-1 flex items-center gap-1.5 text-[10px] text-white/60">
            <Phone size={10} /> {telp}
          </p>
        )}
      </div>
    </aside>
  );
}


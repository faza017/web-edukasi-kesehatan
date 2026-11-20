"use client";

import { Suspense, createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar, { Brand } from "@/components/layout/Sidebar";
import Loader from "@/components/ui/Loader";
import { ROLE_HOME, useAuth } from "@/services/authService";

const ShellContext = createContext({ variant: "pengguna", user: null, ready: false });
export const useShell = () => useContext(ShellContext);

function AppShellInner({ variant = "pengguna", children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPath, setDrawerPath] = useState(pathname);

  // Tutup drawer mobile saat pindah halaman.
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setDrawerOpen(false);
  }

  const forbidden = ready && user && variant === "admin" && user.peran !== "admin";

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (forbidden) router.replace(ROLE_HOME[user.peran]);
  }, [ready, user, forbidden, router, pathname]);

  return (
    <ShellContext.Provider value={{ variant, user, ready }}>
      <div className="min-h-screen bg-page">
        {/* Sidebar desktop */}
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          <Sidebar variant={variant} />
        </div>

        {/* Top bar mobile/tablet (PRD 8 — sidebar menjadi menu hamburger) */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-gradient-to-r from-[#ec4899] to-[#be185d] px-4 py-3 shadow-sm lg:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-white hover:bg-white/10"
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>
        </header>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-brand-900/50"
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
            />
            <Sidebar
              variant={variant}
              className="relative shadow-2xl"
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        )}

        <main className="lg:pl-[210px]">
          <div className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:px-6 lg:px-9 lg:py-7">
            <div
              key={pathname}
              className={
                !ready || !user || forbidden
                  ? "pointer-events-none opacity-0"
                  : "animate-fade-up"
              }
            >
              {children}
            </div>
            {(!ready || !user || forbidden) && <Loader label="Memeriksa sesi..." />}
          </div>
        </main>
      </div>
    </ShellContext.Provider>
  );
}

/**
 * Kerangka halaman setelah login: sidebar + area konten.
 * Dibungkus <Suspense> agar kompatibel dengan Partial Prerendering Next.js 16.
 */
export default function AppShell(props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page">
          <Loader label="Memuat portal..." />
        </div>
      }
    >
      <AppShellInner {...props} />
    </Suspense>
  );
}

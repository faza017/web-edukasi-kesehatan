import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Portal Kesehatan Posyandu Banjar Agung",
    template: "%s — Posyandu Banjar Agung",
  },
  description:
    "Portal Kesehatan Posyandu Banjar Agung: jurnal kesehatan, jadwal dokter, dan jadwal kegiatan dalam satu tempat.",
};

export const viewport = {
  themeColor: "#14532d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

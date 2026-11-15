import AppShell from "@/components/layout/AppShell";

/** Layout Panel Admin (Frame 05–08): sidebar "PANEL ADMIN" + badge "ADMINISTRATOR". */
export default function AdminLayout({ children }) {
  return <AppShell variant="admin">{children}</AppShell>;
}


import RootRedirect from "@/features/auth/RootRedirect";

/** "/" -> diarahkan ke /login, /beranda, atau /admin sesuai sesi. */
export default function HomePage() {
  return <RootRedirect />;
}


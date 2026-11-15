"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { ROLE_HOME, useAuth } from "@/services/authService";

export default function RootRedirect() {
  const router = useRouter();
  const { ready, user } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? ROLE_HOME[user.peran] : "/login");
  }, [ready, user, router]);

  return <Loader label="Mengalihkan..." />;
}


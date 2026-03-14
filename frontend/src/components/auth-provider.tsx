"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { meQueryOptions } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";

const PUBLIC_PATHS = ["/login", "/register"];

function hasLoggedInCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith("logged_in=1"));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    isLoading: storeLoading,
    setUser,
    reset,
    setLoading,
  } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { data, isError, isLoading } = useQuery({
    ...meQueryOptions(),
    enabled: hasLoggedInCookie(),
  });

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);

    if (!hasLoggedInCookie()) {
      reset();
      if (!isPublic) {
        router.replace("/login");
      }
      return;
    }
    if (isLoading) {
      setLoading(true);
      return;
    }
    if (isError || !data) {
      document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax";
      reset();
      if (!isPublic) {
        router.replace("/login");
      }
      return;
    }
    setUser(data.user);
  }, [data, isError, isLoading, setUser, reset, setLoading, router, pathname]);

  if (storeLoading && hasLoggedInCookie()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

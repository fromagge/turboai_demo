"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { PageContainer } from "@/components/PageContainer";
import { Loading } from "@/components/ui/Loading";
import { meQueryOptions } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";

const PUBLIC_PATHS = ["/login", "/register"];

function isNoteEditorPath(path: string): boolean {
  if (path === "/dashboard/new") return true;
  return /^\/dashboard\/\d+$/.test(path);
}

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

  const cookiePresent = hasLoggedInCookie();

  const { data, isError, isLoading } = useQuery({
    ...meQueryOptions(),
    enabled: cookiePresent,
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

  if (storeLoading) {
    return (
      <PageContainer className="text-foreground">
        <Loading />
      </PageContainer>
    );
  }

  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  if (isNoteEditorPath(pathname)) {
    return <>{children}</>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

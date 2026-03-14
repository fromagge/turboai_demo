"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = useAuthStore((s) => s.reset);

  const handleLoggedOut = () => {
    document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax";
    reset();
    queryClient.clear();
    router.push("/login");
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: handleLoggedOut,
    onError: handleLoggedOut,
  });

  return (
    <Button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      variant="filled"
      className={className}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

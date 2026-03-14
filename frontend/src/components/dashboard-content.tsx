"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading, reset } = useAuthStore();

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

  if (isLoading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="rounded border border-gray-200 p-4">
        <p>
          <span className="font-medium">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>
      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

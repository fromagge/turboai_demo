"use client";

import { LogoutButton } from "@/components/ui/logout-button";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardContent() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <p className="text-foreground">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 p-6 text-foreground">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="rounded-input border border-border p-4">
        <p>
          <span className="font-medium">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>
      <LogoutButton className="bg-error text-white" />
    </div>
  );
}

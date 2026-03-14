import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/clients/api";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth";

interface AuthResponse {
  user: User;
}

export function login(data: LoginRequest) {
  return apiClient<AuthResponse>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest) {
  return apiClient<AuthResponse>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  return apiClient<{ message: string }>("/api/auth/logout/", {
    method: "POST",
  });
}

export function getMe() {
  return apiClient<AuthResponse>("/api/auth/me");
}

export function meQueryOptions() {
  return queryOptions({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 30_000,
  });
}

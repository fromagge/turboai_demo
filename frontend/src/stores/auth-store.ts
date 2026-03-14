import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  reset: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
        state.isLoading = false;
      }),
    reset: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      }),
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),
  })),
);

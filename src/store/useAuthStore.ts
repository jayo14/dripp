import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authFn from "@/lib/api/auth";

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email, password) => {
        const res = await authFn.login({ data: { email, password } });
        if (res.ok) set({ user: res.user });
        return res;
      },
      signup: async (name, email, password) => {
        const res = await authFn.signup({ data: { name, email, password } });
        if (res.ok) set({ user: res.user });
        return res;
      },
      logout: () => set({ user: null }),
      resetPassword: async (email, newPassword) => {
        return authFn.resetPassword({ data: { email, newPassword } });
      },
      isAdmin: () => get().user?.role === "admin",
    }),
    { name: "dripp-auth", partialize: (s) => ({ user: s.user }) }
  )
);

// ============================================================================
// AUTH STORE — mock frontend-only auth for demo purposes.
// Persists a fake session in localStorage. Includes a default admin account.
// ============================================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  users: (User & { password: string })[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
  isAdmin: () => boolean;
}

const DEFAULT_USERS: (User & { password: string })[] = [
  {
    id: "admin-1",
    name: "Dripp Admin",
    email: "admin@dripp.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: DEFAULT_USERS,
      login: (email, password) => {
        const u = get().users.find((x) => x.email.toLowerCase() === email.toLowerCase());
        if (!u) return { ok: false, error: "No account found with that email." };
        if (u.password !== password) return { ok: false, error: "Incorrect password." };
        const { password: _pw, ...safe } = u;
        set({ user: safe });
        return { ok: true };
      },
      signup: (name, email, password) => {
        if (get().users.some((x) => x.email.toLowerCase() === email.toLowerCase()))
          return { ok: false, error: "An account with that email already exists." };
        const newUser = {
          id: `u-${Date.now()}`,
          name,
          email,
          password,
          role: "customer" as UserRole,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, newUser], user: { id: newUser.id, name, email, role: "customer", createdAt: newUser.createdAt } }));
        return { ok: true };
      },
      logout: () => set({ user: null }),
      resetPassword: (email, newPassword) => {
        const idx = get().users.findIndex((x) => x.email.toLowerCase() === email.toLowerCase());
        if (idx < 0) return { ok: false, error: "No account found with that email." };
        const next = [...get().users];
        next[idx] = { ...next[idx], password: newPassword };
        set({ users: next });
        return { ok: true };
      },
      isAdmin: () => get().user?.role === "admin",
    }),
    { name: "dripp-auth" }
  )
);

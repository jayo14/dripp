import { createServerFn } from "@tanstack/react-start";

export const login = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { email, password } = data as { email: string; password: string };
  const { getDb } = await import("./db");
  const user = getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false as const, error: "No account found with that email." };
  if (user.password !== password) return { ok: false as const, error: "Incorrect password." };
  return { ok: true as const, user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } };
});

export const signup = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { name, email, password } = data as { name: string; email: string; password: string };
  const { getDb } = await import("./db");
  const db = getDb();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false as const, error: "An account with that email already exists." };
  const user = { id: `u-${Date.now()}`, name, email, password, role: "customer" as const, createdAt: new Date().toISOString() };
  db.users.push(user);
  return { ok: true as const, user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } };
});

export const resetPassword = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { email, newPassword } = data as { email: string; newPassword: string };
  const { getDb } = await import("./db");
  const db = getDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false as const, error: "No account found with that email." };
  user.password = newPassword;
  return { ok: true as const };
});

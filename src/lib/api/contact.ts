import { createServerFn } from "@tanstack/react-start";

export const submitContact = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { name, email, message } = data as { name: string; email: string; message: string };
  const { getDb } = await import("./db");
  const submission = { id: `c-${Date.now()}`, name, email, message, createdAt: new Date().toISOString() };
  getDb().contacts.push(submission);
  return { ok: true };
});

export const subscribeNewsletter = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { email } = data as { email: string };
  const { getDb } = await import("./db");
  const db = getDb();
  if (db.newsletter.some((s) => s.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: "Already subscribed." };
  db.newsletter.push({ email, createdAt: new Date().toISOString() });
  return { ok: true };
});

export const getContacts = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("./db");
  return getDb().contacts;
});

export const getNewsletter = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("./db");
  return getDb().newsletter;
});

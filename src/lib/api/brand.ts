import { createServerFn } from "@tanstack/react-start";

export const getBrandConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("./db");
  return getDb().brandConfig;
});

export const updateBrandConfig = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const patch = data as Record<string, unknown>;
  const { getDb } = await import("./db");
  Object.assign(getDb().brandConfig, patch);
  return { ok: true };
});

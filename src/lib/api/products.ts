import { createServerFn } from "@tanstack/react-start";
import type { Category } from "@/data/products";

let _counter = 0;
const uid = () => `product-${Date.now()}-${++_counter}`;

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("./db");
  return getDb().products;
});

export const getProduct = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { id } = data as { id: string };
  const { getDb } = await import("./db");
  return getDb().products.find((p) => p.id === id) || null;
});

export const createProduct = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const input = data as {
    name: string; price: number; category: Category; subcategory: string;
    images: string[]; colors: { name: string; hex: string }[]; sizes: string[];
    description: string; details: string[]; bestseller?: boolean; newArrival?: boolean;
  };
  const { getDb } = await import("./db");
  const product = { ...input, id: uid() };
  getDb().products.unshift(product);
  return product;
});

export const updateProduct = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { id, ...patch } = data as { id: string } & Record<string, unknown>;
  const { getDb } = await import("./db");
  const db = getDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  db.products[idx] = { ...db.products[idx], ...patch } as any;
  return db.products[idx];
});

export const deleteProduct = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { id } = data as { id: string };
  const { getDb } = await import("./db");
  const db = getDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  db.products.splice(idx, 1);
  return { ok: true };
});

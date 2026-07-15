import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product, type Category } from "@/data/products";

let counter = 0;
const uid = () => `product-${Date.now()}-${++counter}`;

interface ProductStore {
  items: Product[];
  add: (p: Omit<Product, "id">) => void;
  update: (id: string, p: Partial<Product>) => void;
  remove: (id: string) => void;
  getById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      items: PRODUCTS,
      add: (p) =>
        set((s) => ({
          items: [...s.items, { ...p, id: uid() }],
        })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      remove: (id) =>
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
        })),
      getById: (id) => get().items.find((i) => i.id === id),
    }),
    { name: "dripp-products", version: 1 }
  )
);

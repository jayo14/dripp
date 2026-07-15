import { create } from "zustand";
import * as productFn from "@/lib/api/products";
import type { Product, Category } from "@/data/products";

interface ProductStore {
  items: Product[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  add: (p: Omit<Product, "id">) => Promise<void>;
  update: (id: string, p: Partial<Product>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  items: [],
  loading: false,
  fetchAll: async () => {
    set({ loading: true });
    const items = await productFn.listProducts();
    set({ items, loading: false });
  },
  add: async (p) => {
    const product = await productFn.createProduct({ data: p as any });
    set((s) => ({ items: [product, ...s.items] }));
  },
  update: async (id, p) => {
    const updated = await productFn.updateProduct({ data: { id, ...p } });
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }));
  },
  remove: async (id) => {
    await productFn.deleteProduct({ data: { id } });
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },
  getById: (id) => get().items.find((i) => i.id === id),
}));

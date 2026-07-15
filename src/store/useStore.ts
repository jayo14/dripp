import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product: Product;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  theme: "light" | "dark";
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  toggleWishlist: (productId: string) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleTheme: () => void;
  cartCount: () => number;
  cartSubtotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      searchOpen: false,
      mobileMenuOpen: false,
      theme: "light",
      addToCart: (item) =>
        set((s) => {
          const idx = s.cart.findIndex(
            (c) => c.productId === item.productId && c.size === item.size && c.color === item.color
          );
          if (idx >= 0) {
            const next = [...s.cart];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
            return { cart: next, cartOpen: true };
          }
          return { cart: [...s.cart, item], cartOpen: true };
        }),
      removeFromCart: (productId, size, color) =>
        set((s) => ({
          cart: s.cart.filter(
            (c) => !(c.productId === productId && c.size === size && c.color === color)
          ),
        })),
      updateQuantity: (productId, size, color, qty) =>
        set((s) => ({
          cart: s.cart
            .map((c) =>
              c.productId === productId && c.size === size && c.color === color
                ? { ...c, quantity: Math.max(0, qty) }
                : c
            )
            .filter((c) => c.quantity > 0),
        })),
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      setCartOpen: (open) => set({ cartOpen: open }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),
      cartCount: () => get().cart.reduce((n, i) => n + i.quantity, 0),
      cartSubtotal: () => get().cart.reduce((n, i) => n + i.product.price * i.quantity, 0),
    }),
    {
      name: "dripp-store",
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, theme: s.theme }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  THEME_PRESETS,
  type AudienceTheme,
  type ProductCategoryKey,
  ALL_CATEGORIES,
} from "@/config/themes";

export interface BrandConfig {
  name: string;
  tagline: string;
  logoUrl: string | null;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string | null;
  promoText: string;
  audience: AudienceTheme;
  instagram: string;
  whatsapp: string;
  email: string;
  deliveryLocations: string[];
  categories: Record<ProductCategoryKey, boolean>;
  sections: {
    newArrivals: boolean;
    featured: boolean;
    trending: boolean;
    instagram: boolean;
    testimonials: boolean;
    shopByCategory: boolean;
    promoBanner: boolean;
    newsletter: boolean;
  };
}

interface BrandStore extends BrandConfig {
  set: <K extends keyof BrandConfig>(key: K, value: BrandConfig[K]) => void;
  toggleCategory: (k: ProductCategoryKey) => void;
  toggleSection: (k: keyof BrandConfig["sections"]) => void;
  reset: () => void;
  syncToServer: () => Promise<void>;
}

const DEFAULTS: BrandConfig = {
  name: "DRIPP",
  tagline: "Crafted in Lagos. Made to last.",
  logoUrl: null,
  heroEyebrow: "Autumn Collection 2026",
  heroTitle: "Timeless Elegance,\nModern Craftsmanship.",
  heroSubtitle: "Ready-to-wear from Lagos for those who dress with intent.",
  heroImageUrl: null,
  promoText: "Complimentary express shipping on orders over ₦200,000",
  audience: "luxury",
  instagram: "dripp",
  whatsapp: "+2348012345678",
  email: "studio@dripp.ng",
  deliveryLocations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"],
  categories: ALL_CATEGORIES.reduce(
    (acc, c) => ({ ...acc, [c.key]: ["clothing", "bags", "accessories"].includes(c.key) }),
    {} as BrandConfig["categories"]
  ),
  sections: {
    newArrivals: true,
    featured: true,
    trending: true,
    instagram: true,
    testimonials: true,
    shopByCategory: true,
    promoBanner: true,
    newsletter: true,
  },
};

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      set: (key, value) => set({ [key]: value } as any),
      toggleCategory: (k) =>
        set((s) => ({ categories: { ...s.categories, [k]: !s.categories[k] } })),
      toggleSection: (k) =>
        set((s) => ({ sections: { ...s.sections, [k]: !s.sections[k] } })),
      reset: () => set(DEFAULTS),
      syncToServer: async () => {
        const { updateBrandConfig } = await import("@/lib/api/brand");
        const { syncToServer: _, ...config } = get();
        await updateBrandConfig({ data: config });
      },
    }),
    { name: "dripp-brand-config", version: 1 }
  )
);

export const getActiveTheme = (audience: AudienceTheme) => THEME_PRESETS[audience];

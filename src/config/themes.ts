// ============================================================================
// FASHION AUDIENCE THEME PRESETS
// Each preset re-skins the storefront: palette, typography, spacing, mood.
// ============================================================================

export type AudienceTheme =
  | "luxury"
  | "women"
  | "men"
  | "unisex"
  | "streetwear"
  | "minimal";

export interface ThemePreset {
  id: AudienceTheme;
  label: string;
  description: string;
  // OKLCH or any CSS color — applied as CSS variables on :root
  vars: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    border: string;
    gold: string;
  };
  fonts: {
    display: string; // headings
    body: string;
    googleHref: string; // <link> href to load both
  };
  radius: string; // base radius
  tracking: string; // letter spacing for luxury labels
  uppercaseLabels: boolean;
}

export const THEME_PRESETS: Record<AudienceTheme, ThemePreset> = {
  luxury: {
    id: "luxury",
    label: "Luxury",
    description: "Editorial, restrained, gold accents",
    vars: {
      background: "oklch(0.972 0.008 75)",
      foreground: "oklch(0.18 0.005 60)",
      primary: "oklch(0.18 0.005 60)",
      primaryForeground: "oklch(0.972 0.008 75)",
      muted: "oklch(0.93 0.012 80)",
      mutedForeground: "oklch(0.45 0.01 60)",
      accent: "oklch(0.86 0.02 80)",
      border: "oklch(0.88 0.01 75)",
      gold: "oklch(0.78 0.06 70)",
    },
    fonts: {
      display: '"Cormorant Garamond", serif',
      body: '"Inter", system-ui, sans-serif',
      googleHref:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap",
    },
    radius: "0px",
    tracking: "0.22em",
    uppercaseLabels: true,
  },
  women: {
    id: "women",
    label: "Women's Fashion",
    description: "Soft, romantic, blush palette",
    vars: {
      background: "oklch(0.985 0.006 20)",
      foreground: "oklch(0.22 0.02 20)",
      primary: "oklch(0.55 0.12 20)",
      primaryForeground: "oklch(0.99 0 0)",
      muted: "oklch(0.95 0.01 20)",
      mutedForeground: "oklch(0.5 0.02 20)",
      accent: "oklch(0.88 0.05 20)",
      border: "oklch(0.9 0.01 20)",
      gold: "oklch(0.75 0.1 50)",
    },
    fonts: {
      display: '"Playfair Display", serif',
      body: '"Outfit", system-ui, sans-serif',
      googleHref:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Outfit:wght@300;400;500&display=swap",
    },
    radius: "4px",
    tracking: "0.18em",
    uppercaseLabels: true,
  },
  men: {
    id: "men",
    label: "Men's Fashion",
    description: "Bold, confident, dark slate",
    vars: {
      background: "oklch(0.14 0.005 240)",
      foreground: "oklch(0.95 0.005 240)",
      primary: "oklch(0.95 0.005 240)",
      primaryForeground: "oklch(0.14 0.005 240)",
      muted: "oklch(0.22 0.005 240)",
      mutedForeground: "oklch(0.65 0.01 240)",
      accent: "oklch(0.28 0.02 240)",
      border: "oklch(0.28 0.005 240)",
      gold: "oklch(0.78 0.06 70)",
    },
    fonts: {
      display: '"Archivo", system-ui, sans-serif',
      body: '"Inter", system-ui, sans-serif',
      googleHref:
        "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800&family=Inter:wght@300;400;500&display=swap",
    },
    radius: "0px",
    tracking: "0.16em",
    uppercaseLabels: true,
  },
  unisex: {
    id: "unisex",
    label: "Unisex",
    description: "Balanced, neutral, contemporary",
    vars: {
      background: "oklch(0.97 0 0)",
      foreground: "oklch(0.2 0 0)",
      primary: "oklch(0.2 0 0)",
      primaryForeground: "oklch(0.97 0 0)",
      muted: "oklch(0.93 0 0)",
      mutedForeground: "oklch(0.5 0 0)",
      accent: "oklch(0.85 0 0)",
      border: "oklch(0.88 0 0)",
      gold: "oklch(0.7 0.12 60)",
    },
    fonts: {
      display: '"Space Grotesk", system-ui, sans-serif',
      body: '"DM Sans", system-ui, sans-serif',
      googleHref:
        "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Space+Grotesk:wght@400;500;600&display=swap",
    },
    radius: "8px",
    tracking: "0.12em",
    uppercaseLabels: false,
  },
  streetwear: {
    id: "streetwear",
    label: "Streetwear",
    description: "Loud, urban, high-contrast",
    vars: {
      background: "oklch(0.99 0 0)",
      foreground: "oklch(0.1 0 0)",
      primary: "oklch(0.65 0.25 30)",
      primaryForeground: "oklch(0.99 0 0)",
      muted: "oklch(0.95 0 0)",
      mutedForeground: "oklch(0.45 0 0)",
      accent: "oklch(0.85 0.18 90)",
      border: "oklch(0.1 0 0)",
      gold: "oklch(0.85 0.18 90)",
    },
    fonts: {
      display: '"Bebas Neue", sans-serif',
      body: '"Inter", system-ui, sans-serif',
      googleHref:
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap",
    },
    radius: "2px",
    tracking: "0.06em",
    uppercaseLabels: true,
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "Quiet, white-space, geometric",
    vars: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.15 0 0)",
      primary: "oklch(0.15 0 0)",
      primaryForeground: "oklch(1 0 0)",
      muted: "oklch(0.96 0 0)",
      mutedForeground: "oklch(0.55 0 0)",
      accent: "oklch(0.92 0 0)",
      border: "oklch(0.9 0 0)",
      gold: "oklch(0.6 0 0)",
    },
    fonts: {
      display: '"Inter Tight", system-ui, sans-serif',
      body: '"Inter", system-ui, sans-serif',
      googleHref:
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&family=Inter:wght@300;400;500&display=swap",
    },
    radius: "0px",
    tracking: "0.2em",
    uppercaseLabels: true,
  },
};

// Product category catalog — toggleable on/off by the brand
export type ProductCategoryKey =
  | "clothing"
  | "footwear"
  | "bags"
  | "jewelry"
  | "accessories"
  | "watches"
  | "perfumes"
  | "beauty";

export const ALL_CATEGORIES: { key: ProductCategoryKey; label: string }[] = [
  { key: "clothing", label: "Clothing" },
  { key: "footwear", label: "Footwear" },
  { key: "bags", label: "Bags" },
  { key: "jewelry", label: "Jewelry" },
  { key: "accessories", label: "Accessories" },
  { key: "watches", label: "Watches" },
  { key: "perfumes", label: "Perfumes" },
  { key: "beauty", label: "Beauty" },
];

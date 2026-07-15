import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Category = "women" | "men" | "accessories";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  subcategory: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
  bestseller?: boolean;
  newArrival?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "silk-slip-dress",
    name: "Adaeze Silk Slip Dress",
    price: 285000,
    category: "women",
    subcategory: "Dresses",
    images: [p1, p3, p5],
    colors: [
      { name: "Champagne", hex: "#D4AF88" },
      { name: "Charcoal", hex: "#1A1A1A" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A languid bias-cut slip in heavyweight silk satin. Cut to drape effortlessly, finished with adjustable straps and a low cowl back.",
    details: ["100% Mulberry Silk", "Made in Lagos", "Dry clean only", "Fits true to size"],
    newArrival: true,
    bestseller: true,
  },
  {
    id: "tailored-blazer-onyx",
    name: "Onyx Tailored Blazer",
    price: 320000,
    category: "men",
    subcategory: "Tailoring",
    images: [p2, p6, p5],
    colors: [
      { name: "Onyx", hex: "#1A1A1A" },
      { name: "Sand", hex: "#D4C9B8" },
    ],
    sizes: ["46", "48", "50", "52", "54"],
    description:
      "A single-breasted blazer in fine Italian wool. Tailored to a slim modern silhouette with hand-finished lapels and horn buttons.",
    details: ["Italian virgin wool", "Half-canvas construction", "Horn buttons", "Made in Lagos"],
    newArrival: true,
  },
  {
    id: "cashmere-knit-cream",
    name: "Folake Cashmere Knit",
    price: 195000,
    category: "women",
    subcategory: "Knitwear",
    images: [p3, p1, p6],
    colors: [
      { name: "Cream", hex: "#F8F5F2" },
      { name: "Camel", hex: "#B89878" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "An oversized rib-knit pullover spun from Mongolian cashmere. Soft, weighty and built to outlast the season.",
    details: ["100% Cashmere", "Hand-finished seams", "Made in Italy"],
    bestseller: true,
  },
  {
    id: "structured-leather-tote",
    name: "Lagos Leather Tote",
    price: 410000,
    category: "accessories",
    subcategory: "Bags",
    images: [p4],
    colors: [
      { name: "Cognac", hex: "#9A5B30" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["One Size"],
    description:
      "A structured day tote in vegetable-tanned calfskin. Roomy enough for a laptop, refined enough for evening.",
    details: ["Italian calfskin", "Suede lining", "Brass hardware", "Made in Florence"],
    bestseller: true,
    newArrival: true,
  },
  {
    id: "wide-leg-trouser",
    name: "Ife Wide-Leg Trouser",
    price: 165000,
    category: "women",
    subcategory: "Trousers",
    images: [p5, p2, p3],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Beige", hex: "#D4C9B8" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A fluid wide-leg trouser cut from a fine wool crepe. High-waisted, pressed to a sharp crease, falling clean to the floor.",
    details: ["Wool crepe", "Concealed side zip", "Made in Lagos"],
    newArrival: true,
  },
  {
    id: "linen-shirt-bone",
    name: "Bone Linen Shirt",
    price: 125000,
    category: "men",
    subcategory: "Shirts",
    images: [p6, p2, p1],
    colors: [
      { name: "Bone", hex: "#F2EBDD" },
      { name: "Stone", hex: "#C9BFAE" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A relaxed-fit shirt in heavyweight Belgian linen. Mother-of-pearl buttons, single-needle stitching throughout.",
    details: ["Belgian linen", "Mother-of-pearl buttons", "Made in Lagos"],
    bestseller: true,
  },
  {
    id: "merino-trouser-charcoal",
    name: "Charcoal Merino Trouser",
    price: 185000,
    category: "men",
    subcategory: "Trousers",
    images: [p5, p2],
    colors: [{ name: "Charcoal", hex: "#1A1A1A" }],
    sizes: ["46", "48", "50", "52"],
    description: "A clean-lined trouser cut from year-round merino with a flat front and slim straight leg.",
    details: ["Merino wool", "Flat-front", "Made in Lagos"],
  },
  {
    id: "silk-scarf-gold",
    name: "Hand-Painted Silk Scarf",
    price: 75000,
    category: "accessories",
    subcategory: "Scarves",
    images: [p4, p1],
    colors: [{ name: "Gold", hex: "#D4AF88" }],
    sizes: ["One Size"],
    description: "A hand-rolled silk twill scarf, painted in our Lagos atelier. Each piece is unique.",
    details: ["Silk twill", "Hand-rolled edges", "Made in Lagos"],
    newArrival: true,
  },
];

export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

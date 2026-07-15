import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useBrandStore } from "@/store/useBrandStore";

const CATEGORIES = [
  { label: "Women", category: "women" as const, image: "/assets/category-women.png" },
  { label: "Men", category: "men" as const, image: "/assets/category-men.png" },
  { label: "Accessories", category: "accessories" as const, image: "/assets/category-accessories.png" },
];

export function ShopByCategory() {
  const visible = useBrandStore((s) => s.sections.shopByCategory);
  if (!visible) return null;
  return (
    <section className="container-luxe py-24">
      <div className="mb-12 text-center">
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Browse</p>
        <h2 className="mt-2 text-3xl font-light md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          Shop by Category
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link
              to="/shop"
              search={{ category: c.category }}
              className="group relative block aspect-[3/4] overflow-hidden bg-muted"
            >
              <img
                src={c.image}
                alt={c.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/40 to-transparent p-6">
                <span className="text-lg font-light tracking-luxury text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {c.label}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

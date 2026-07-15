import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { PRODUCTS, type Category } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const searchSchema = z.object({
  category: z.enum(["women", "men", "accessories"]).optional(),
  sort: z.enum(["new", "low", "high"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — Dripp" },
      { name: "description", content: "Browse the full Dripp collection of ready-to-wear and accessories." },
    ],
  }),
});

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "46", "48", "50", "52", "54", "One Size"];

function Shop() {
  const { category, sort = "new" } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [priceMax, setPriceMax] = useState(500000);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(8);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category) list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price <= priceMax);
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, priceMax, sizes, colors, sort]);

  const allColors = Array.from(new Set(PRODUCTS.flatMap((p) => p.colors.map((c) => c.name))));

  const setCat = (c?: Category) => navigate({ search: (s: any) => ({ ...s, category: c }) });
  const setSort = (s: "new" | "low" | "high") => navigate({ search: (prev: any) => ({ ...prev, sort: s }) });

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Collection</p>
          <h1 className="mt-2 text-4xl font-light md:text-5xl">
            {category ? category[0].toUpperCase() + category.slice(1) : "All Pieces"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{filtered.length} pieces</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["women", "men", "accessories"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(category === c ? undefined : c)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-luxury transition ${
                category === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        {/* DESKTOP FILTERS */}
        <aside className="hidden md:block">
          <Filters
            priceMax={priceMax} setPriceMax={setPriceMax}
            sizes={sizes} setSizes={setSizes}
            colors={colors} setColors={setColors}
            allColors={allColors}
          />
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="ml-auto border border-border bg-background px-3 py-2 text-xs uppercase tracking-luxury outline-none"
            >
              <option value="new">Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">No pieces match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {filtered.slice(0, visible).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}

          {visible < filtered.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + 8)}
                className="border border-border px-8 py-3 text-xs uppercase tracking-luxury hover:border-foreground"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)} className="fixed inset-0 z-50 bg-foreground/40 md:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-background p-6 md:hidden">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-luxury">Filters</span>
                <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <Filters
                priceMax={priceMax} setPriceMax={setPriceMax}
                sizes={sizes} setSizes={setSizes}
                colors={colors} setColors={setColors}
                allColors={allColors}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Filters({ priceMax, setPriceMax, sizes, setSizes, colors, setColors, allColors }: any) {
  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 text-[11px] uppercase tracking-luxury">Price (max)</h4>
        <input type="range" min={50000} max={500000} step={10000} value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">Up to ₦{priceMax.toLocaleString()}</p>
      </div>
      <div>
        <h4 className="mb-4 text-[11px] uppercase tracking-luxury">Size</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button key={s} onClick={() => toggle(sizes, s, setSizes)}
              className={`border px-3 py-1.5 text-[11px] ${sizes.includes(s) ? "border-foreground bg-foreground text-background" : "border-border"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-4 text-[11px] uppercase tracking-luxury">Color</h4>
        <div className="space-y-2">
          {allColors.map((c: string) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-xs">
              <input type="checkbox" checked={colors.includes(c)} onChange={() => toggle(colors, c, setColors)}
                className="h-3 w-3 accent-foreground" />
              {c}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

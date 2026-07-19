import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useProductStore } from "@/store/useProductStore";
import { type Category } from "@/data/products";
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
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);

  useEffect(() => { fetchProducts(); }, []);

  const [priceMax, setPriceMax] = useState(500000);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(8);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price <= priceMax);
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, priceMax, sizes, colors, sort]);

  const allColors = Array.from(new Set(products.flatMap((p) => p.colors.map((c) => c.name))));

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
              className={`border px-6 py-3 text-xs uppercase tracking-luxury transition ${
                category === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-xs uppercase tracking-luxury hover:opacity-70">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <div className="flex gap-4 text-xs uppercase tracking-luxury">
          {(["new", "low", "high"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`${sort === s ? "text-foreground underline" : "text-muted-foreground hover:text-foreground"}`}>
              {s === "new" ? "Newest" : s === "low" ? "Price: Low" : "Price: High"}
            </button>
          ))}
        </div>
      </div>

      {category && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-luxury text-muted-foreground">Active:</span>
          <button onClick={() => setCat(undefined)} className="flex items-center gap-1 border border-border px-3 py-1 text-xs hover:border-foreground">
            {category} <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {filtersOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border border-border bg-muted/30 p-6">
          <p className="text-[11px] uppercase tracking-luxury">Price</p>
          <input type="range" min={0} max={500000} step={10000} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="mt-3 w-full accent-foreground" />
          <p className="mt-1 text-xs text-muted-foreground">Max: ₦{priceMax.toLocaleString()}</p>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-luxury">Size</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((s) => (
                  <button key={s} onClick={() => setSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                    className={`min-w-[44px] border px-3 py-2 text-xs ${sizes.includes(s) ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-luxury">Color</p>
              <div className="flex flex-wrap gap-2">
                {allColors.map((c) => (
                  <button key={c} onClick={() => setColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
                    className={`border px-3 py-2 text-xs ${colors.includes(c) ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {filtered.slice(0, visible).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>

      {visible < filtered.length && (
        <div className="mt-16 text-center">
          <button onClick={() => setVisible((v) => v + 8)} className="border border-border px-10 py-4 text-xs uppercase tracking-luxury hover:border-foreground">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

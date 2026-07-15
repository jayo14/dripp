import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatNaira } from "@/data/products";
import { useStore } from "@/store/useStore";

export function QuickView({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const addToCart = useStore((s) => s.addToCart);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 grid w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 grid-cols-1 bg-background md:grid-cols-2"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 bg-background/80 p-2">
              <X className="h-4 w-4" />
            </button>
            <img src={product.images[0]} alt={product.name} className="aspect-[4/5] h-full w-full object-cover" />
            <div className="flex flex-col gap-5 p-8">
              <div>
                <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">{product.subcategory}</p>
                <h2 className="mt-2 text-2xl font-light">{product.name}</h2>
                <p className="mt-2 text-base">{formatNaira(product.price)}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>

              <div>
                <p className="mb-2 text-[11px] uppercase tracking-luxury">Color: {color}</p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`h-7 w-7 border ${color === c.name ? "ring-1 ring-offset-2 ring-foreground" : "border-border"}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] uppercase tracking-luxury">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[44px] border px-3 py-2 text-xs ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-4">
                <button
                  onClick={() => {
                    addToCart({ productId: product.id, size, color, quantity: 1, product });
                    onClose();
                  }}
                  className="bg-foreground py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => { onClose(); navigate({ to: "/product/$productId", params: { productId: product.id } }); }}
                  className="border border-border py-3 text-xs uppercase tracking-luxury hover:border-foreground"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

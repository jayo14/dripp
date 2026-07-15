import { Link } from "@tanstack/react-router";
import { Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatNaira } from "@/data/products";
import { useStore } from "@/store/useStore";
import { QuickView } from "./QuickView";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isWished = wishlist.includes(product.id);
  const [quick, setQuick] = useState(false);
  const [hover, setHover] = useState(false);
  const second = product.images[1] ?? product.images[0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
        className="group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          className="block"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: hover ? 0 : 1 }}
            />
            <img
              src={second}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out"
              style={{ transform: hover ? "scale(1.04)" : "scale(1)" }}
            />
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              aria-label="Save to wishlist"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-background/80 backdrop-blur transition hover:bg-background"
            >
              <Heart className={`h-4 w-4 ${isWished ? "fill-current text-gold" : ""}`} />
            </button>
            {product.newArrival && (
              <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-luxury">
                New
              </span>
            )}
            <motion.button
              initial={false}
              animate={{ y: hover ? 0 : 16, opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.preventDefault(); setQuick(true); }}
              className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-foreground py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90"
            >
              <Eye className="h-3.5 w-3.5" /> Quick View
            </motion.button>
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">{product.subcategory}</p>
              <h3 className="mt-1 text-sm font-light">{product.name}</h3>
            </div>
            <p className="text-sm">{formatNaira(product.price)}</p>
          </div>
        </Link>
      </motion.div>
      <QuickView product={product} open={quick} onClose={() => setQuick(false)} />
    </>
  );
}

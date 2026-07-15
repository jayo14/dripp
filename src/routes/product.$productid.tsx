import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ChevronDown } from "lucide-react";
import { PRODUCTS, formatNaira, type Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <p className="text-sm uppercase tracking-luxury">Product not found</p>
      <Link to="/shop" className="mt-4 inline-block text-xs underline">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [openTab, setOpenTab] = useState<string | null>("description");

  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isWished = wishlist.includes(product.id);
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="container-luxe py-10">
      <Link to="/shop" className="text-[11px] uppercase tracking-luxury text-muted-foreground hover:text-foreground">
        ← Back to Shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`aspect-[4/5] overflow-hidden border-2 ${activeImg === i ? "border-foreground" : "border-transparent"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="relative aspect-[4/5] overflow-hidden bg-muted cursor-zoom-in"
            onClick={() => setZoom(!zoom)}
          >
            <img src={product.images[activeImg]} alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`} />
          </motion.div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">{product.subcategory}</p>
          <h1 className="mt-2 text-3xl font-light md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg">{formatNaira(product.price)}</p>

          <div className="mt-8">
            <p className="mb-3 text-[11px] uppercase tracking-luxury">Color: <span className="text-muted-foreground normal-case tracking-normal">{color}</span></p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} aria-label={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`h-8 w-8 border ${color === c.name ? "ring-1 ring-offset-2 ring-foreground" : "border-border"}`} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-luxury">Size</p>
              <button className="text-[11px] uppercase tracking-luxury text-muted-foreground underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`min-w-[52px] border px-4 py-3 text-xs ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-muted" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-muted" aria-label="Increase"><Plus className="h-3 w-3" /></button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart({ productId: product.id, size, color, quantity: qty, product })}
              className="flex-1 bg-foreground py-4 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90"
            >
              Add to Bag
            </motion.button>
            <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist"
              className="flex w-14 items-center justify-center border border-border hover:border-foreground">
              <Heart className={`h-4 w-4 ${isWished ? "fill-current text-gold" : ""}`} />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-12 border-t border-border">
            {[
              { id: "description", label: "Description", body: <p>{product.description}</p> },
              { id: "details", label: "Details & Care", body: (
                <ul className="space-y-1">{product.details.map((d) => <li key={d}>— {d}</li>)}</ul>
              )},
              { id: "shipping", label: "Shipping & Returns", body: (
                <div className="space-y-2">
                  <p>Complimentary express shipping on orders over ₦200,000.</p>
                  <p>Returns accepted within 14 days, unworn with original packaging.</p>
                </div>
              )},
            ].map((tab) => (
              <div key={tab.id} className="border-b border-border">
                <button onClick={() => setOpenTab(openTab === tab.id ? null : tab.id)}
                  className="flex w-full items-center justify-between py-5 text-xs uppercase tracking-luxury">
                  {tab.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openTab === tab.id ? "rotate-180" : ""}`} />
                </button>
                {openTab === tab.id && (
                  <div className="pb-5 text-sm leading-relaxed text-muted-foreground">{tab.body}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* You may also like */}
      {related.length > 0 && (
        <section className="mt-32">
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">More to Discover</p>
          <h2 className="mt-2 text-3xl font-light md:text-4xl">You May Also Like</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-[64px] z-30 flex gap-2 border-t border-border bg-background/90 p-3 backdrop-blur-xl md:hidden">
        <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist"
          className="flex w-12 items-center justify-center border border-border">
          <Heart className={`h-4 w-4 ${isWished ? "fill-current text-gold" : ""}`} />
        </button>
        <button
          onClick={() => addToCart({ productId: product.id, size, color, quantity: qty, product })}
          className="flex-1 bg-foreground py-3 text-xs uppercase tracking-luxury text-background"
        >
          Add to Bag · {formatNaira(product.price * qty)}
        </button>
      </div>
    </div>
  );
}

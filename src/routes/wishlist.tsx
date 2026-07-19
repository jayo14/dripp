import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/ProductCard";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
  head: () => ({ meta: [{ title: "Wishlist — Dripp" }, { name: "description", content: "Your saved Dripp pieces." }] }),
});

function Wishlist() {
  const ids = useStore((s) => s.wishlist);
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);

  useEffect(() => { fetchProducts(); }, []);

  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-luxe py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Saved For Later</p>
      <h1 className="mt-2 text-4xl font-light md:text-5xl">Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-6 text-center">
          <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">You haven't saved any pieces yet.</p>
          <Link to="/shop" className="border border-border px-8 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
            Discover the Collection
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}

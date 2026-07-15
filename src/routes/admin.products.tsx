import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { PRODUCTS, formatNaira, type Product } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [items, setItems] = useState<Product[]>(PRODUCTS);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Product["category"]>("all");

  const filtered = items.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product removed (demo)");
  };

  const cats: ("all" | Product["category"])[] = ["all", "women", "men", "accessories"];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Catalogue</p>
          <h1 className="mt-2 text-3xl font-light">Products</h1>
        </div>
        <Button onClick={() => toast.info("New product form — demo")} className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury">
          <Plus className="mr-2 h-4 w-4" /> New product
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-3 py-1.5 text-[11px] uppercase tracking-luxury transition",
                cat === c ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-luxury text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Sizes</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-12 w-12 object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.subcategory}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{p.sizes.join(", ")}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex gap-2">
                    {p.newArrival && <span className="bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-luxury text-background">New</span>}
                    {p.bestseller && <span className="border border-foreground px-2 py-0.5 text-[10px] uppercase tracking-luxury">Best</span>}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => toast.info("Edit form — demo")} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.id)} className="p-2 text-muted-foreground hover:text-rose-600" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

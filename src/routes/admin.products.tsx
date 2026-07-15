import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { formatNaira, type Category } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, "Price must be > 0"),
  category: z.enum(["women", "men", "accessories"]),
  subcategory: z.string().min(1, "Subcategory is required"),
  images: z.string().min(1, "At least one image URL required"),
  colors: z.string().min(1, "At least one color required"),
  sizes: z.string().min(1, "At least one size required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().optional(),
  bestseller: z.boolean(),
  newArrival: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const defaultForm: ProductFormData = {
  name: "",
  price: 0,
  category: "women",
  subcategory: "",
  images: "",
  colors: "",
  sizes: "",
  description: "",
  details: "",
  bestseller: false,
  newArrival: false,
};

const CATS: { label: string; value: "all" | Category }[] = [
  { label: "All", value: "all" },
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Accessories", value: "accessories" },
];

function AdminProducts() {
  const items = useProductStore((s) => s.items);
  const addProduct = useProductStore((s) => s.add);
  const updateProduct = useProductStore((s) => s.update);
  const removeProduct = useProductStore((s) => s.remove);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultForm,
  });

  const openAdd = () => {
    setEditingId(null);
    reset(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const p = useProductStore.getState().getById(id);
    if (!p) return;
    setEditingId(id);
    reset({
      name: p.name,
      price: p.price,
      category: p.category,
      subcategory: p.subcategory,
      images: p.images.join(", "),
      colors: p.colors.map((c) => `${c.name}:${c.hex}`).join(", "),
      sizes: p.sizes.join(", "),
      description: p.description,
      details: p.details.join("\n"),
      bestseller: p.bestseller ?? false,
      newArrival: p.newArrival ?? false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const onSubmit = (data: ProductFormData) => {
    const images = data.images.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = data.colors.split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
      const [name, hex] = s.split(":").map((p) => p.trim());
      return { name, hex: hex || "#000000" };
    });
    const sizes = data.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const details = (data.details || "").split("\n").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: data.name,
      price: data.price,
      category: data.category,
      subcategory: data.subcategory,
      images,
      colors,
      sizes,
      description: data.description,
      details,
      bestseller: data.bestseller,
      newArrival: data.newArrival,
    };

    if (editingId) {
      updateProduct(editingId, payload);
      toast.success("Product updated");
    } else {
      addProduct(payload);
      toast.success("Product added");
    }

    closeModal();
  };

  const remove = (id: string) => {
    removeProduct(id);
    toast.success("Product removed");
  };

  const filtered = items.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Catalogue</p>
          <h1 className="mt-2 text-3xl font-light">Products</h1>
        </div>
        <Button onClick={openAdd} className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury">
          <Plus className="mr-2 h-4 w-4" /> New product
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {CATS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={cn(
                "px-3 py-1.5 text-[11px] uppercase tracking-luxury transition",
                cat === c.value ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-luxury text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="hidden px-4 py-3 text-left sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Sizes</th>
              <th className="hidden px-4 py-3 text-left lg:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-10 shrink-0 object-cover sm:h-12 sm:w-12" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.subcategory}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 capitalize sm:table-cell">{p.category}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatNaira(p.price)}</td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">{p.sizes.join(", ")}</td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <span className="inline-flex gap-2">
                    {p.newArrival && <span className="bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-luxury text-background">New</span>}
                    {p.bestseller && <span className="border border-foreground px-2 py-0.5 text-[10px] uppercase tracking-luxury">Best</span>}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(p.id)} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Edit">
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

      {/* Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-4 pb-10 sm:pt-10">
          <div className="relative w-full max-w-xl mx-4 rounded-lg border border-border bg-background p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-light">{editingId ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input id="price" type="number" {...register("price")} />
                  {errors.price && <p className="text-xs text-rose-500">{errors.price.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" {...register("category")} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input id="subcategory" {...register("subcategory")} />
                  {errors.subcategory && <p className="text-xs text-rose-500">{errors.subcategory.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="images">Image URLs (comma-separated)</Label>
                  <Input id="images" placeholder="/assets/product-1.png, /assets/product-2.png" {...register("images")} />
                  {errors.images && <p className="text-xs text-rose-500">{errors.images.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="colors">Colors (name:hex, comma-separated)</Label>
                  <Input id="colors" placeholder="Champagne:#D4AF88, Black:#1A1A1A" {...register("colors")} />
                  {errors.colors && <p className="text-xs text-rose-500">{errors.colors.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                  <Input id="sizes" placeholder="XS, S, M, L, XL" {...register("sizes")} />
                  {errors.sizes && <p className="text-xs text-rose-500">{errors.sizes.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} />
                  {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="details">Details (one per line)</Label>
                  <Textarea id="details" placeholder="100% Mulberry Silk&#10;Made in Lagos&#10;Dry clean only" {...register("details")} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("bestseller")} className="h-4 w-4 accent-foreground" />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("newArrival")} className="h-4 w-4 accent-foreground" />
                  New arrival
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                <Button type="submit" className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury">
                  {editingId ? "Update" : "Add"} product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

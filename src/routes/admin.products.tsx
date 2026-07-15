import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Search, Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
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

const SIZES_BY_CAT: Record<Category, string[]> = {
  women: ["XS", "S", "M", "L", "XL"],
  men: ["S", "M", "L", "XL", "XXL"],
  accessories: ["One Size"],
};

const CATS: { label: string; value: "all" | Category }[] = [
  { label: "All", value: "all" },
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Accessories", value: "accessories" },
];

interface FormState {
  name: string;
  price: string;
  category: Category;
  subcategory: string;
  images: string[];
  newImages: File[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string;
  bestseller: boolean;
  newArrival: boolean;
}

const emptyForm = (): FormState => ({
  name: "",
  price: "",
  category: "women",
  subcategory: "",
  images: [],
  newImages: [],
  colors: [],
  sizes: [],
  description: "",
  details: "",
  bestseller: false,
  newArrival: false,
});

function AdminProducts() {
  const items = useProductStore((s) => s.items);
  const loading = useProductStore((s) => s.loading);
  const fetchAll = useProductStore((s) => s.fetchAll);
  const addProduct = useProductStore((s) => s.add);
  const updateProduct = useProductStore((s) => s.update);
  const removeProduct = useProductStore((s) => s.remove);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "colors" | "sizes", string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const colorNameRef = useRef<HTMLInputElement>(null);
  const colorHexRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const p = useProductStore.getState().getById(id);
    if (!p) return;
    setEditingId(id);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      subcategory: p.subcategory,
      images: p.images,
      newImages: [],
      colors: p.colors.map((c) => ({ ...c })),
      sizes: [...p.sizes],
      description: p.description,
      details: p.details.join("\n"),
      bestseller: p.bestseller ?? false,
      newArrival: p.newArrival ?? false,
    });
    setErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    fileRef.current && (fileRef.current.value = "");
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const valid: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith("image/")) valid.push(f);
    }
    if (valid.length === 0) return;
    set("newImages", [...form.newImages, ...valid]);
  };

  const removeNewImage = (idx: number) => {
    const next = form.newImages.filter((_, i) => i !== idx);
    set("newImages", next);
  };

  const removeExistingImage = (idx: number) => {
    const next = form.images.filter((_, i) => i !== idx);
    set("images", next);
  };

  const addColor = () => {
    const name = (colorNameRef.current?.value || "").trim();
    const hex = (colorHexRef.current?.value || "#000000").trim();
    if (!name) return;
    if (form.colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    set("colors", [...form.colors, { name, hex }]);
    if (colorNameRef.current) colorNameRef.current.value = "";
    if (colorHexRef.current) colorHexRef.current.value = "#000000";
  };

  const removeColor = (idx: number) => {
    set("colors", form.colors.filter((_, i) => i !== idx));
  };

  const toggleSize = (s: string) => {
    set(
      "sizes",
      form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s],
    );
  };

  const addCustomSize = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter" && val && !form.sizes.includes(val)) {
      e.preventDefault();
      set("sizes", [...form.sizes, val]);
      (e.target as HTMLInputElement).value = "";
    }
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    const priceNum = Number(form.price);
    if (!form.price.trim() || isNaN(priceNum) || priceNum < 1) errs.price = "Valid price required";
    if (!form.subcategory.trim()) errs.subcategory = "Subcategory is required";
    if (form.images.length === 0 && form.newImages.length === 0) errs.images = "At least one image required";
    if (form.colors.length === 0) errs.colors = "At least one color required";
    if (form.sizes.length === 0) errs.sizes = "At least one size required";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const readFiles = (files: File[]): Promise<string[]> =>
    Promise.all(
      files.map(
        (f) =>
          new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result as string);
            reader.readAsDataURL(f);
          }),
      ),
    );

  const onSubmit = async () => {
    if (!validate()) return;
    const newDataUrls = await readFiles(form.newImages);
    const allImages = [...form.images, ...newDataUrls];
    const details = form.details.split("\n").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      subcategory: form.subcategory.trim(),
      images: allImages,
      colors: form.colors,
      sizes: form.sizes,
      description: form.description.trim(),
      details,
      bestseller: form.bestseller,
      newArrival: form.newArrival,
    };

    if (editingId) {
      updateProduct(editingId, payload);
      toast.success("Product updated");
    } else {
      addProduct(payload);
      toast.success("Product added");
    }
    closeDialog();
  };

  const filtered = items.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog();
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
                    <button onClick={() => { removeProduct(p.id); toast.success("Product removed"); }} className="p-2 text-muted-foreground hover:text-rose-600" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Loading products…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog: modal on desktop, full-screen on mobile */}
      {dialogOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/40 sm:block" onClick={closeDialog} />

          <div
            className={cn(
              "fixed z-50 overflow-y-auto",
              /* mobile: full-screen */
              "inset-0 bg-background",
              /* desktop: centered modal */
              "sm:inset-auto sm:top-[5vh] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:rounded-lg sm:border sm:border-border sm:bg-background sm:shadow-xl sm:max-h-[90vh]",
            )}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-4 sm:px-6">
              <h2 className="text-lg font-light">{editingId ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeDialog} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-6 px-4 py-6 sm:px-6">
              {/* Name & Price row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="p-name">Product name</Label>
                  <Input id="p-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Adaeze Silk Slip Dress" />
                  {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-price">Price (₦)</Label>
                  <Input id="p-price" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="285000" />
                  {errors.price && <p className="text-xs text-rose-500">{errors.price}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-category">Category</Label>
                  <select
                    id="p-category"
                    value={form.category}
                    onChange={(e) => {
                      const cat = e.target.value as Category;
                      set("category", cat);
                      set("sizes", form.sizes.filter((s) => SIZES_BY_CAT[cat].includes(s) || s === "One Size"));
                    }}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              {/* Subcategory */}
              <div className="space-y-1">
                <Label htmlFor="p-sub">Subcategory</Label>
                <Input id="p-sub" value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} placeholder="Dresses, Tailoring, Knitwear…" />
                {errors.subcategory && <p className="text-xs text-rose-500">{errors.subcategory}</p>}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Images</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition"
                >
                  <Upload className="h-5 w-5" />
                  Upload images
                </button>
                {errors.images && <p className="text-xs text-rose-500">{errors.images}</p>}
                {(form.images.length > 0 || form.newImages.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((src, i) => (
                      <div key={`e-${i}`} className="relative group h-20 w-20 shrink-0">
                        <img src={src} alt="" className="h-full w-full object-cover rounded border border-border" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white group-hover:flex"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {form.newImages.map((file, i) => (
                      <div key={`n-${i}`} className="relative group h-20 w-20 shrink-0">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="h-full w-full object-cover rounded border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white group-hover:flex"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded">
                          <ImageIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex gap-2">
                  <Input ref={colorNameRef} placeholder="Color name" className="flex-1" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} />
                  <input
                    ref={colorHexRef}
                    type="color"
                    defaultValue="#000000"
                    className="h-10 w-10 cursor-pointer rounded border border-border bg-background p-0.5"
                  />
                  <Button type="button" variant="outline" onClick={addColor} className="shrink-0 rounded-none text-xs uppercase tracking-luxury">
                    Add
                  </Button>
                </div>
                {errors.colors && <p className="text-xs text-rose-500">{errors.colors}</p>}
                {form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {form.colors.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs">
                        <span className="h-3.5 w-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                        {c.name}
                        <button type="button" onClick={() => removeColor(i)} className="ml-0.5 text-muted-foreground hover:text-rose-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES_BY_CAT[form.category].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={cn(
                        "px-3 py-1.5 text-xs uppercase tracking-luxury transition",
                        form.sizes.includes(s)
                          ? "bg-foreground text-background"
                          : "border border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                  <input
                    placeholder="+ custom"
                    onKeyDown={addCustomSize}
                    className="w-20 border-0 border-b border-border bg-transparent px-2 py-1.5 text-xs uppercase tracking-luxury outline-none focus:border-foreground"
                  />
                </div>
                {errors.sizes && <p className="text-xs text-rose-500">{errors.sizes}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="p-desc">Description</Label>
                <Textarea
                  id="p-desc"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="A languid bias-cut slip in heavyweight silk satin…"
                  rows={3}
                />
                {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
              </div>

              {/* Details */}
              <div className="space-y-1">
                <Label htmlFor="p-details">Details (one per line)</Label>
                <Textarea
                  id="p-details"
                  value={form.details}
                  onChange={(e) => set("details", e.target.value)}
                  placeholder="100% Mulberry Silk&#10;Made in Lagos&#10;Dry clean only"
                  rows={3}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.bestseller}
                    onChange={(e) => set("bestseller", e.target.checked)}
                    className="h-4 w-4 accent-foreground"
                  />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.newArrival}
                    onChange={(e) => set("newArrival", e.target.checked)}
                    className="h-4 w-4 accent-foreground"
                  />
                  New arrival
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-background px-4 py-4 sm:px-6">
              <Button type="button" variant="outline" onClick={closeDialog} className="rounded-none text-xs uppercase tracking-luxury">
                Cancel
              </Button>
              <Button onClick={onSubmit} className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury">
                {editingId ? "Update" : "Add"} product
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

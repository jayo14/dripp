// ============================================================================
// CLIENT DEMO ADMIN PANEL
// Floating cog → slide-in drawer to retheme the storefront live.
// Use for rapid client demos: swap brand, colors, fonts, categories, hero copy.
// ============================================================================
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, RotateCcw, Upload } from "lucide-react";
import { useBrandStore } from "@/store/useBrandStore";
import { THEME_PRESETS, ALL_CATEGORIES, type AudienceTheme } from "@/config/themes";

export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const brand = useBrandStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const onLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => brand.set("logoUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Brand settings"
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center bg-foreground text-background shadow-lg transition hover:scale-105 md:bottom-6"
        style={{ borderRadius: "var(--radius)" }}
      >
        <Settings className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Demo Studio</p>
                  <h2 className="text-lg font-light">Brand Settings</h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
                {/* AUDIENCE THEME */}
                <Section title="Fashion Audience">
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(THEME_PRESETS) as AudienceTheme[]).map((id) => {
                      const t = THEME_PRESETS[id];
                      const active = brand.audience === id;
                      return (
                        <button
                          key={id}
                          onClick={() => brand.set("audience", id)}
                          className={`border p-3 text-left transition ${active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                        >
                          <p className="text-xs font-medium">{t.label}</p>
                          <p className="mt-1 text-[10px] opacity-70">{t.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </Section>

                {/* BRAND IDENTITY */}
                <Section title="Brand Identity">
                  <Field label="Brand Name">
                    <input value={brand.name} onChange={(e) => brand.set("name", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Tagline">
                    <input value={brand.tagline} onChange={(e) => brand.set("tagline", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Logo">
                    <div className="flex items-center gap-3">
                      {brand.logoUrl && <img src={brand.logoUrl} alt="" className="h-10 w-10 object-contain" />}
                      <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs hover:border-foreground">
                        <Upload className="h-3 w-3" /> {brand.logoUrl ? "Replace" : "Upload"}
                      </button>
                      {brand.logoUrl && (
                        <button onClick={() => brand.set("logoUrl", null)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onLogoUpload} />
                    </div>
                  </Field>
                </Section>

                {/* HERO */}
                <Section title="Hero Section">
                  <Field label="Eyebrow">
                    <input value={brand.heroEyebrow} onChange={(e) => brand.set("heroEyebrow", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Title">
                    <textarea value={brand.heroTitle} onChange={(e) => brand.set("heroTitle", e.target.value)} rows={2} className={inp} />
                  </Field>
                  <Field label="Subtitle">
                    <input value={brand.heroSubtitle} onChange={(e) => brand.set("heroSubtitle", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Promo Banner Text">
                    <input value={brand.promoText} onChange={(e) => brand.set("promoText", e.target.value)} className={inp} />
                  </Field>
                </Section>

                {/* CONTACT */}
                <Section title="Contact & Social">
                  <Field label="Instagram (without @)">
                    <input value={brand.instagram} onChange={(e) => brand.set("instagram", e.target.value)} className={inp} />
                  </Field>
                  <Field label="WhatsApp (with country code)">
                    <input value={brand.whatsapp} onChange={(e) => brand.set("whatsapp", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Email">
                    <input value={brand.email} onChange={(e) => brand.set("email", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Delivery Locations (comma-separated)">
                    <input
                      value={brand.deliveryLocations.join(", ")}
                      onChange={(e) => brand.set("deliveryLocations", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                      className={inp}
                    />
                  </Field>
                </Section>

                {/* CATEGORIES */}
                <Section title="Product Categories">
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_CATEGORIES.map((c) => (
                      <label key={c.key} className="flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-xs">
                        <input
                          type="checkbox"
                          checked={brand.categories[c.key]}
                          onChange={() => brand.toggleCategory(c.key)}
                          className="accent-foreground"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </Section>

                {/* SECTIONS */}
                <Section title="Homepage Sections">
                  {(Object.keys(brand.sections) as (keyof typeof brand.sections)[]).map((k) => (
                    <label key={k} className="flex cursor-pointer items-center justify-between border-b border-border py-2 text-xs capitalize">
                      <span>{k.replace(/([A-Z])/g, " $1")}</span>
                      <input
                        type="checkbox"
                        checked={brand.sections[k]}
                        onChange={() => brand.toggleSection(k)}
                        className="accent-foreground"
                      />
                    </label>
                  ))}
                </Section>

                <button
                  onClick={brand.reset}
                  className="inline-flex items-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-luxury hover:border-foreground"
                >
                  <RotateCcw className="h-3 w-3" /> Reset to defaults
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const inp = "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] uppercase tracking-luxury text-muted-foreground">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBrandStore } from "@/store/useBrandStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { THEME_PRESETS, type AudienceTheme } from "@/config/themes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const brand = useBrandStore();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await brand.syncToServer();
    setSaving(false);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Configuration</p>
        <h1 className="mt-2 text-3xl font-light">Store settings</h1>
      </header>

      {/* Brand */}
      <section className="border border-border bg-background p-6 space-y-5">
        <h2 className="text-sm uppercase tracking-luxury">Brand</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Name</label>
            <Input value={brand.name} onChange={(e) => brand.set("name", e.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Tagline</label>
            <Input value={brand.tagline} onChange={(e) => brand.set("tagline", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Promo bar text</label>
          <Input value={brand.promoText} onChange={(e) => brand.set("promoText", e.target.value)} />
        </div>
      </section>

      {/* Theme */}
      <section className="border border-border bg-background p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-luxury">Theme</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(Object.keys(THEME_PRESETS) as AudienceTheme[]).map((k) => (
            <button
              key={k}
              onClick={() => brand.set("audience", k)}
              className={cn(
                "border p-3 text-left text-xs uppercase tracking-luxury transition",
                brand.audience === k ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border border-border bg-background p-6 space-y-5">
        <h2 className="text-sm uppercase tracking-luxury">Contact</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Email</label>
            <Input type="email" value={brand.email} onChange={(e) => brand.set("email", e.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">WhatsApp</label>
            <Input value={brand.whatsapp} onChange={(e) => brand.set("whatsapp", e.target.value)} placeholder="+234..." />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Instagram handle</label>
            <Input value={brand.instagram} onChange={(e) => brand.set("instagram", e.target.value)} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => brand.reset()} className="rounded-none text-xs uppercase tracking-luxury">
          Reset to defaults
        </Button>
        <Button onClick={save} disabled={saving} className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

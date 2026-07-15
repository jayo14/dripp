// Applies live brand theme: CSS variables, fonts, document title.
import { useEffect } from "react";
import { useBrandStore, getActiveTheme } from "@/store/useBrandStore";

export function BrandThemeApplier() {
  const audience = useBrandStore((s) => s.audience);
  const name = useBrandStore((s) => s.name);
  const tagline = useBrandStore((s) => s.tagline);

  useEffect(() => {
    const t = getActiveTheme(audience);
    const root = document.documentElement;
    const v = t.vars;
    root.style.setProperty("--background", v.background);
    root.style.setProperty("--foreground", v.foreground);
    root.style.setProperty("--primary", v.primary);
    root.style.setProperty("--primary-foreground", v.primaryForeground);
    root.style.setProperty("--muted", v.muted);
    root.style.setProperty("--muted-foreground", v.mutedForeground);
    root.style.setProperty("--accent", v.accent);
    root.style.setProperty("--accent-foreground", v.foreground);
    root.style.setProperty("--card", v.background);
    root.style.setProperty("--card-foreground", v.foreground);
    root.style.setProperty("--popover", v.background);
    root.style.setProperty("--popover-foreground", v.foreground);
    root.style.setProperty("--border", v.border);
    root.style.setProperty("--input", v.border);
    root.style.setProperty("--ring", v.primary);
    root.style.setProperty("--gold", v.gold);
    root.style.setProperty("--radius", t.radius);
    root.style.setProperty("--font-display", t.fonts.display);
    root.style.setProperty("--font-sans", t.fonts.body);
    root.style.setProperty("--brand-tracking", t.tracking);

    // load font stylesheet (one per preset, dedupe)
    const id = `brand-fonts-${audience}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = t.fonts.googleHref;
      document.head.appendChild(link);
    }
  }, [audience]);

  useEffect(() => {
    document.title = `${name} — ${tagline}`;
  }, [name, tagline]);

  return null;
}

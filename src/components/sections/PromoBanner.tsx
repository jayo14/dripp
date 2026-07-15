import { useBrandStore } from "@/store/useBrandStore";

export function PromoBanner() {
  const text = useBrandStore((s) => s.promoText);
  const visible = useBrandStore((s) => s.sections.promoBanner);
  if (!visible || !text) return null;
  return (
    <div className="bg-foreground py-2 text-center text-[11px] uppercase tracking-luxury text-background">
      <div className="container-luxe overflow-hidden">
        <p className="truncate">{text}</p>
      </div>
    </div>
  );
}

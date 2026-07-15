import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useBrandStore } from "@/store/useBrandStore";
import catWomen from "@/assets/category-women.jpg";
import catMen from "@/assets/category-men.jpg";
import catAcc from "@/assets/category-accessories.jpg";
import hero from "@/assets/hero-1.jpg";
import brand from "@/assets/brand-story.jpg";
import p1 from "@/assets/product-1.jpg";

export function InstagramGallery() {
  const visible = useBrandStore((s) => s.sections.instagram);
  const handle = useBrandStore((s) => s.instagram);
  if (!visible) return null;
  const imgs = [hero, catWomen, p1, catMen, brand, catAcc];

  return (
    <section className="container-luxe py-24">
      <div className="mb-12 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">@{handle}</p>
          <h2 className="mt-2 text-3xl font-light md:text-4xl">From the Feed</h2>
        </div>
        <a
          href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
          className="hidden items-center gap-2 text-xs uppercase tracking-luxury hover:text-gold md:inline-flex"
        >
          <Instagram className="h-3 w-3" /> Follow
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:gap-3">
        {imgs.map((src, i) => (
          <motion.a
            key={i} href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative block aspect-square overflow-hidden bg-muted"
          >
            <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/30">
              <Instagram className="h-6 w-6 text-background opacity-0 transition group-hover:opacity-100" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

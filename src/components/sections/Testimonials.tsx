import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useBrandStore } from "@/store/useBrandStore";

const ITEMS = [
  { quote: "The tailoring is on another level. I wear my pieces weekly and they still look brand new.", name: "Amaka O.", city: "Lagos" },
  { quote: "Finally, an African luxury brand that delivers on every promise. Packaging, quality, service.", name: "Tunde A.", city: "Abuja" },
  { quote: "Effortlessly modern. I get compliments every time I step out in their dresses.", name: "Zainab M.", city: "Port Harcourt" },
];

export function Testimonials() {
  const visible = useBrandStore((s) => s.sections.testimonials);
  if (!visible) return null;
  return (
    <section className="container-luxe py-24">
      <div className="mb-12 text-center">
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">In Their Words</p>
        <h2 className="mt-2 text-3xl font-light md:text-4xl">Loved by Tastemakers</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {ITEMS.map((t, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="border border-border p-8"
          >
            <Quote className="h-6 w-6 text-gold" strokeWidth={1} />
            <blockquote className="mt-6 text-base font-light leading-relaxed">"{t.quote}"</blockquote>
            <figcaption className="mt-6 text-[11px] uppercase tracking-luxury text-muted-foreground">
              {t.name} · {t.city}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

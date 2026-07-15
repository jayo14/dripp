import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
const brandImg = "/assets/brand-story.png";
const hero = "/assets/hero-1.png";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Dripp" },
      { name: "description", content: "Dripp is a Lagos-based ready-to-wear house dedicated to considered design and lasting craftsmanship." },
    ],
  }),
});

function About() {
  return (
    <div>
      <section className="container-luxe py-20 md:py-28">
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Our Story</p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-light leading-tight md:text-6xl">
          A Lagos house, building a quieter wardrobe.
        </h1>
      </section>

      <section className="container-luxe">
        <img src={hero} alt="Dripp campaign" className="aspect-[16/9] w-full object-cover" />
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-light md:text-4xl">Considered, not loud.</h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Dripp was founded in Lagos in 2021 with a simple intent: to make
              clothes that reward attention. Our pieces are designed to live with you —
              softening with wear, holding their shape across seasons, ready for the next morning.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We work in small runs, with a small team of cutters and finishers we know by name.
              Every garment is made within walking distance of our studio in Ikoyi.
            </p>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            src={brandImg} alt="Atelier" className="aspect-[4/5] w-full object-cover" />
        </div>
      </section>

      <section className="bg-secondary/30">
        <div className="container-luxe grid gap-12 py-20 md:grid-cols-3 md:py-28">
          {[
            { n: "01", t: "Material First", d: "Italian wool, Belgian linen, Mongolian cashmere. We start with the fabric and let it lead." },
            { n: "02", t: "Small Runs", d: "We make fewer pieces, more deliberately. Nothing in our atelier is mass-produced." },
            { n: "03", t: "Built to Last", d: "Half-canvas tailoring, single-needle stitching, finishings done by hand." },
          ].map((v, i) => (
            <motion.div key={v.n}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <p className="text-xs text-gold tracking-luxury">{v.n}</p>
              <h3 className="mt-4 text-xl font-light">{v.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

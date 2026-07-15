import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useBrandStore } from "@/store/useBrandStore";
import { ShopByCategory } from "@/components/sections/ShopByCategory";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Newsletter } from "@/components/sections/Newsletter";
import hero from "@/assets/hero-1.jpg";
import brandImg from "@/assets/brand-story.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const brand = useBrandStore();
  const newArrivals = PRODUCTS.filter((p) => p.newArrival);
  const bestSellers = PRODUCTS.filter((p) => p.bestseller).slice(0, 4);
  const trending = [...PRODUCTS].slice(0, 4);
  const heroImg = brand.heroImageUrl ?? hero;

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
        <div className="container-luxe relative z-10 flex h-full flex-col justify-end pb-20 text-white md:pb-32">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-[11px] uppercase tracking-luxury">
            {brand.heroEyebrow}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}
            className="mt-4 max-w-3xl whitespace-pre-line text-balance text-4xl font-light leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}>
            {brand.heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-md text-sm text-white/80 md:text-base">
            {brand.heroSubtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="inline-flex items-center justify-center bg-white px-8 py-4 text-xs uppercase tracking-luxury text-black hover:bg-white/90">
              Shop Now
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center border border-white/70 px-8 py-4 text-xs uppercase tracking-luxury text-white hover:bg-white/10">
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {brand.sections.newArrivals && (
        <section className="container-luxe py-24">
          <SectionHead eyebrow="Just In" title="New Arrivals" link={{ to: "/shop", label: "View All" }} />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* SHOP BY CATEGORY */}
      <ShopByCategory />

      {/* BEST SELLERS / FEATURED */}
      {brand.sections.featured && (
        <section className="container-luxe py-24">
          <SectionHead eyebrow="House Favourites" title="Featured Collection" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* PROMO STRIP */}
      <section className="bg-foreground py-16 text-background md:py-24">
        <div className="container-luxe text-center">
          <p className="text-[11px] uppercase tracking-luxury opacity-60">Limited Drop</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-light md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            The {brand.name} Edit — handpicked, in season.
          </h2>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 border border-background/30 px-8 py-4 text-xs uppercase tracking-luxury hover:bg-background hover:text-foreground">
            Shop the Edit <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* TRENDING */}
      {brand.sections.trending && (
        <section className="container-luxe py-24">
          <SectionHead eyebrow="Right Now" title="Trending" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* BRAND STORY */}
      <section className="container-luxe py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.img initial={{ opacity: 0, scale: 1.05 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            src={brandImg} alt={`The ${brand.name} atelier`} className="aspect-[4/5] w-full object-cover" />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Our House</p>
            <h2 className="mt-4 text-3xl font-light md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              {brand.tagline}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {brand.name} is a study in restraint. Each piece is cut and finished from materials sourced for their longevity. We make fewer things, considered.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-luxury hover:text-gold">
              Read Our Story <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </div>
  );
}

function SectionHead({ eyebrow, title, link }: { eyebrow: string; title: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-light md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      </div>
      {link && (
        <Link to={link.to} className="hidden items-center gap-2 text-xs uppercase tracking-luxury hover:text-gold md:inline-flex">
          {link.label} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

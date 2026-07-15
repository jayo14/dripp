// ============================================================================
// AUTH LAYOUT — shared editorial split-screen for login/signup/password pages.
// ============================================================================
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useBrandStore } from "@/store/useBrandStore";

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const brand = useBrandStore();
  const heroImg =
    brand.heroImageUrl ||
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Editorial image */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-[10px] uppercase tracking-luxury opacity-80">{brand.name}</p>
          <p className="mt-3 text-2xl font-light leading-snug">
            {brand.tagline || "Wear the story. Live the craft."}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="text-[10px] uppercase tracking-luxury text-muted-foreground hover:text-foreground">
            ← Back to store
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-luxury text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8 sm:mt-10">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}

import { Link, useRouter } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, Menu, X, Sun, Moon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { motion, AnimatePresence } from "framer-motion";
import { formatNaira } from "@/data/products";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "Women", search: { category: "women" } },
  { to: "/shop", label: "Men", search: { category: "men" } },
  { to: "/shop", label: "Accessories", search: { category: "accessories" } },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const cartCount = useStore((s) => s.cartCount());
  const wishlistCount = useStore((s) => s.wishlist.length);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const searchOpen = useStore((s) => s.searchOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const mobileOpen = useStore((s) => s.mobileMenuOpen);
  const setMobileOpen = useStore((s) => s.setMobileMenuOpen);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const brandName = useBrandStore((s) => s.name);
  const brandLogo = useBrandStore((s) => s.logoUrl);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [theme]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
            : "border-b border-transparent bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="container-luxe flex h-16 items-center justify-between md:h-20">
          <button
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 text-2xl font-light tracking-luxury md:text-[1.6rem]" style={{ fontFamily: "var(--font-display)" }}>
            {brandLogo && <img src={brandLogo} alt="" className="h-7 w-7 object-contain" />}
            {brandName}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                search={(item as any).search}
                className="text-xs uppercase tracking-luxury text-foreground/80 hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="hover:opacity-70">
              <Search className="h-5 w-5" />
            </button>
            <button aria-label="Toggle theme" onClick={toggleTheme} className="hidden hover:opacity-70 md:block">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <AccountMenu />
            <Link to="/wishlist" aria-label="Wishlist" className="relative hover:opacity-70">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-primary text-[10px] text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button aria-label="Cart" onClick={() => setCartOpen(true)} className="relative hover:opacity-70">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-primary text-[10px] text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function AccountMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link to="/login" aria-label="Sign in" className="hover:opacity-70">
        <User className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button aria-label="Account" onClick={() => setOpen((v) => !v)} onBlur={() => setTimeout(() => setOpen(false), 150)} className="flex h-8 w-8 items-center justify-center bg-foreground text-[11px] font-medium text-background">
        {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-2 w-56 border border-border bg-background p-2 shadow-lg"
          >
            <div className="border-b border-border px-3 py-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            {user.role === "admin" && (
              <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-muted">Admin dashboard</Link>
            )}
            <Link to="/wishlist" className="block px-3 py-2 text-sm hover:bg-muted">Wishlist</Link>
            <button onMouseDown={(e) => { e.preventDefault(); logout(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-muted">
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);

  useEffect(() => { fetchProducts(); }, []);

  const results = q
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="container-luxe pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-luxury text-muted-foreground">Search</span>
              <button aria-label="Close" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What are you looking for?"
              className="mt-8 w-full border-b border-border bg-transparent pb-4 text-2xl font-light outline-none placeholder:text-muted-foreground md:text-4xl"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onClose();
                    router.navigate({ to: "/product/$productId", params: { productId: p.id } });
                  }}
                  className="group flex items-center gap-4 text-left"
                >
                  <img src={p.images[0]} alt={p.name} className="h-20 w-16 object-cover" />
                  <div>
                    <p className="text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatNaira(p.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/30"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-background p-6"
          >
            <div className="mb-12 flex items-center justify-between">
              <span className="text-xl font-light tracking-luxury" style={{ fontFamily: "var(--font-display)" }}>{useBrandStore.getState().name}</span>
              <button aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex flex-col gap-6">
              {NAV.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  search={(item as any).search}
                  onClick={onClose}
                  className="text-2xl font-light"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

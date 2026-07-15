// Sticky mobile bottom navigation — thumb-friendly, hidden on desktop.
import { Link } from "@tanstack/react-router";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/store/useStore";

export function MobileBottomNav() {
  const cartCount = useStore((s) => s.cartCount());
  const wishlistCount = useStore((s) => s.wishlist.length);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden">
      <Link to="/" className="flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider">
        <Home className="h-5 w-5" /> Home
      </Link>
      <Link to="/shop" className="flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider">
        <ShoppingBag className="h-5 w-5" /> Shop
      </Link>
      <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider">
        <Search className="h-5 w-5" /> Search
      </button>
      <Link to="/wishlist" className="relative flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider">
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute right-4 top-2 flex h-4 w-4 items-center justify-center bg-foreground text-[9px] text-background">{wishlistCount}</span>
        )}
        Saved
      </Link>
      <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider">
        <User className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute right-4 top-2 flex h-4 w-4 items-center justify-center bg-foreground text-[9px] text-background">{cartCount}</span>
        )}
        Bag
      </button>
    </nav>
  );
}

import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="container-luxe py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-light tracking-luxury">DRIPP</h3>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Ready-to-wear, considered and crafted in Lagos. For those who dress with intent.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-gold transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxury text-muted-foreground">Shop</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/shop" search={{ category: "women" }} className="hover:text-gold">Women</Link></li>
              <li><Link to="/shop" search={{ category: "men" }} className="hover:text-gold">Men</Link></li>
              <li><Link to="/shop" search={{ category: "accessories" }} className="hover:text-gold">Accessories</Link></li>
              <li><Link to="/shop" className="hover:text-gold">All Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxury text-muted-foreground">House</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-gold">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
              <li><a href="#" className="hover:text-gold">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-gold">Care Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxury text-muted-foreground">Newsletter</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Private previews and seasonal lookbooks, sent monthly.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setSubscribed(true); setEmail(""); }}
              className="mt-4 flex border-b border-border"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="text-xs uppercase tracking-luxury hover:text-gold">
                Join
              </button>
            </form>
            {subscribed && <p className="mt-2 text-xs text-gold">Welcome to the house.</p>}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Dripp. Lagos, Nigeria.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

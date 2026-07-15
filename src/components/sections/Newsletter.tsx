import { useState } from "react";
import { useBrandStore } from "@/store/useBrandStore";

export function Newsletter() {
  const visible = useBrandStore((s) => s.sections.newsletter);
  const name = useBrandStore((s) => s.name);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (!visible) return null;
  return (
    <section className="border-y border-border bg-muted/40 py-24">
      <div className="container-luxe text-center">
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Newsletter</p>
        <h2 className="mt-2 text-3xl font-light md:text-4xl">Join the {name} List</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Private previews, lookbooks and early access to new drops — sent monthly. No spam.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); setDone(true); setEmail(""); }}
          className="mx-auto mt-8 flex max-w-md border border-border bg-background"
        >
          <input
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          />
          <button className="bg-foreground px-6 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">
            Subscribe
          </button>
        </form>
        {done && <p className="mt-4 text-xs text-gold">Welcome aboard.</p>}
      </div>
    </section>
  );
}

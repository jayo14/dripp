import { useState } from "react";
import { useBrandStore } from "@/store/useBrandStore";
import { subscribeNewsletter } from "@/lib/api/contact";

export function Newsletter() {
  const visible = useBrandStore((s) => s.sections.newsletter);
  const name = useBrandStore((s) => s.name);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  if (!visible) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await subscribeNewsletter({ data: { email } });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Something went wrong");
      return;
    }
    setDone(true);
    setEmail("");
  };

  return (
    <section className="border-y border-border bg-muted/40 py-24">
      <div className="container-luxe text-center">
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Newsletter</p>
        <h2 className="mt-2 text-3xl font-light md:text-4xl">Join the {name} List</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Private previews, lookbooks and early access to new drops — sent monthly. No spam.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md border border-border bg-background">
          <input
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          />
          <button disabled={loading} className="bg-foreground px-6 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">
            {loading ? "Sending…" : "Subscribe"}
          </button>
        </form>
        {done && <p className="mt-4 text-xs text-gold">Welcome aboard.</p>}
        {error && <p className="mt-4 text-xs text-rose-500">{error}</p>}
      </div>
    </section>
  );
}

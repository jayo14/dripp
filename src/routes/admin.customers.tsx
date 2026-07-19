import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Mail } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { formatNaira } from "@/data/products";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const orders = useOrderStore((s) => s.items);
  const fetchOrders = useOrderStore((s) => s.fetchAll);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (orders.length === 0) fetchOrders();
  }, []);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; location: string; orders: number; spent: number; joined: string }>();
    for (const o of orders) {
      if (!map.has(o.email)) {
        map.set(o.email, {
          name: o.name,
          email: o.email,
          location: o.address?.city || "",
          orders: 0,
          spent: 0,
          joined: o.createdAt,
        });
      }
      const c = map.get(o.email)!;
      c.orders++;
      c.spent += o.total;
      if (o.createdAt < c.joined) c.joined = o.createdAt;
    }
    return Array.from(map.values());
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      q === "" ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase()) ||
      c.location.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Community</p>
        <h1 className="mt-2 text-3xl font-light">Customers</h1>
      </header>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search name, email or city" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div key={c.email} className="border border-border bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.location}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center bg-muted text-sm font-medium">
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            </div>
            <a href={`mailto:${c.email}`} className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <Mail className="h-3 w-3" /> {c.email}
            </a>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">Orders</p>
                <p className="mt-1 text-sm font-medium">{c.orders}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">Spent</p>
                <p className="mt-1 text-sm font-medium">{formatNaira(c.spent)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">Joined</p>
                <p className="mt-1 text-sm font-medium">{c.joined.slice(0, 7)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

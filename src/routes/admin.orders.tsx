import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { STATUS_STYLES, type OrderStatus } from "@/data/mockOrders";
import { useOrderStore } from "@/store/useOrderStore";
import { formatNaira } from "@/data/products";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES: (OrderStatus | "all")[] = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const seed = useOrderStore((s) => s.seed);

  useEffect(() => { seed(); }, [seed]);

  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");

  const filtered = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (q === "" ||
        o.id.toLowerCase().includes(q.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(q.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(q.toLowerCase()))
  );

  const onStatusChange = (id: string, status: OrderStatus) => updateStatus(id, status);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Fulfillment</p>
        <h1 className="mt-2 text-3xl font-light">Orders</h1>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search order, customer, email" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1.5 text-[11px] uppercase tracking-luxury transition",
                filter === s ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-luxury text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="hidden px-4 py-3 text-left sm:table-cell">Date</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Payment</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{o.customer.email}</p>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className="text-[10px] uppercase tracking-luxury">
                    {o.paymentMethod === "card" ? "Card" : "WhatsApp"}
                    {o.paid ? "" : " · Unpaid"}
                  </span>
                </td>
                <td className="px-4 py-3">{formatNaira(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => onStatusChange(o.id, e.target.value as OrderStatus)}
                    className={cn("border-0 px-2 py-1 text-[10px] uppercase tracking-luxury outline-none", STATUS_STYLES[o.status])}
                  >
                    {(["pending", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No orders match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

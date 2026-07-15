import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Package, CheckCircle2, Truck, XCircle, Clock, Loader2 } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { formatNaira } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking")({
  component: TrackingPage,
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  head: () => ({ meta: [{ title: "Order Tracking — Dripp" }] }),
});

const STATUS_ICONS: Record<string, typeof Package> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

function TrackingPage() {
  const { id: initialId } = useSearch({ from: "/tracking" });
  const fetchOrders = useOrderStore((s) => s.fetchAll);
  const allOrders = useOrderStore((s) => s.orders);
  const [q, setQ] = useState(initialId || "");
  const [searched, setSearched] = useState<string | null>(initialId || null);
  const [loading, setLoading] = useState(false);
  const order = searched ? useOrderStore((s) => s.getById(searched)) : undefined;
  const notFound = searched && !loading && allOrders.length > 0 && !order;

  useEffect(() => {
    if (initialId) {
      setSearched(initialId);
      setLoading(true);
      fetchOrders().finally(() => setLoading(false));
    } else {
      fetchOrders();
    }
  }, [initialId, fetchOrders]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(q.trim());
    setLoading(true);
    await fetchOrders();
    setLoading(false);
  };

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-light md:text-4xl">Order Tracking</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">Enter your order ID to check the status of your delivery.</p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. DR-ABCD-1"
            className="flex-1 border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-foreground px-6 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90"
          >
            <Search className="h-4 w-4" /> Track
          </button>
        </form>

        {loading && (
          <div className="mt-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Searching…</p>
          </div>
        )}
        {notFound && (
          <div className="mt-12 text-center">
            <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">No order found with ID <span className="font-mono text-foreground">{searched}</span>.</p>
            <p className="mt-1 text-xs text-muted-foreground">Please check the ID and try again. Orders appear after checkout.</p>
          </div>
        )}

        {order && (
          <div className="mt-12 space-y-8">
            {/* Header */}
            <div className="border border-border bg-background p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Order</p>
                  <p className="mt-1 font-mono text-lg">{order.id}</p>
                </div>
                <span
                  className={cn(
                    "self-start px-3 py-1 text-[10px] uppercase tracking-luxury",
                    order.status === "delivered" && "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
                    order.status === "shipped" && "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200",
                    order.status === "processing" && "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
                    order.status === "pending" && "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
                    order.status === "cancelled" && "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
                  )}
                >
                  {order.status}
                </span>
              </div>
              <div className="mt-4 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <p>{order.customer.name}</p>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
                <p>{order.customer.address}, {order.customer.city}</p>
              </div>
            </div>

            {/* Tracking timeline */}
            <div className="border border-border bg-background p-6">
              <h2 className="text-sm uppercase tracking-luxury">Tracking</h2>
              <div className="mt-6 space-y-0">
                {order.tracking.map((evt, i) => {
                  const Icon = STATUS_ICONS[evt.status] || Package;
                  const isLast = i === order.tracking.length - 1;
                  return (
                    <div key={evt.date} className="relative flex gap-4 pb-6">
                      {!isLast && <div className="absolute left-[15px] top-8 h-full w-px bg-border" />}
                      <div
                        className={cn(
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          isLast ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="pt-1">
                        <p className={cn("text-sm font-medium capitalize", isLast && "text-foreground")}>{evt.status}</p>
                        <p className="text-xs text-muted-foreground">{evt.description}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {new Date(evt.date).toLocaleDateString("en-NG", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="border border-border bg-background p-6">
              <h2 className="text-sm uppercase tracking-luxury">Items</h2>
              <div className="mt-4 divide-y divide-border">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <img src={item.image} alt="" className="h-16 w-14 object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.color} · {item.size} · ×{item.quantity}</p>
                    </div>
                    <p className="whitespace-nowrap text-sm">{formatNaira(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border border-border bg-background p-6">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatNaira(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatNaira(order.shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 font-medium">
                  <span>Total</span><span>{formatNaira(order.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-2">
                  <span>Payment</span>
                  <span className="capitalize">{order.paymentMethod === "card" ? "Card" : "WhatsApp"}{order.paid ? " · Paid" : " · Pending"}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/shop" className="inline-block border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

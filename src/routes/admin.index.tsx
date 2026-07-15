import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { formatNaira } from "@/data/products";
import { STATUS_STYLES } from "@/data/mockOrders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchAll);
  const products = useProductStore((s) => s.items);
  const fetchProducts = useProductStore((s) => s.fetchAll);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = activeOrders.reduce((n, o) => n + o.total, 0);
  const uniqueCustomers = new Set(activeOrders.map((o) => o.customer.email)).size;
  const recent = orders.slice(0, 5);

  const stats = [
    { label: "Revenue", value: formatNaira(totalRevenue), delta: "+12.4%", up: true, icon: TrendingUp },
    { label: "Orders", value: orders.length.toString(), delta: "+8.1%", up: true, icon: ShoppingBag },
    { label: "Customers", value: uniqueCustomers.toString(), delta: "+2.9%", up: true, icon: Users },
    { label: "Products", value: products.length.toString(), delta: "0", up: true, icon: Package },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Overview</p>
        <h1 className="mt-2 text-3xl font-light">Dashboard</h1>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-border bg-background p-6"
          >
            <div className="flex items-start justify-between">
              <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-4 text-2xl font-light">{s.value}</p>
            <p className={cn("mt-2 flex items-center gap-1 text-xs", s.up ? "text-emerald-600" : "text-rose-600")}>
              {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {s.delta} <span className="text-muted-foreground">vs last month</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders + top products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="border border-border bg-background p-6 lg:col-span-2">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-luxury">Recent orders</h2>
            <Link to="/admin/orders" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
          </header>
          <div className="divide-y divide-border">
            {recent.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{o.id} · {o.items.length} item(s)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-luxury", STATUS_STYLES[o.status])}>
                      {o.status}
                    </span>
                    <span className="w-24 text-right text-sm">{formatNaira(o.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="border border-border bg-background p-6">
          <h2 className="mb-4 text-sm uppercase tracking-luxury">Top products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="h-12 w-12 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNaira(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

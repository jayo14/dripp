import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async () => {
        const { listProducts } = await import("@/lib/api/products");
        const { listOrders } = await import("@/lib/api/orders");
        const [products, orders] = await Promise.all([listProducts(), listOrders()]);
        const activeOrders = orders.filter((o: any) => o.status !== "cancelled");
        const totalRevenue = activeOrders.reduce((n: number, o: any) => n + o.total, 0);
        const uniqueCustomers = new Set(activeOrders.map((o: any) => o.customer?.email)).size;
        return json({
          totalRevenue,
          totalOrders: orders.length,
          activeOrders: activeOrders.length,
          totalCustomers: uniqueCustomers,
          totalProducts: products.length,
          recentOrders: orders.slice(0, 5),
          topProducts: products.slice(0, 5),
        });
      },
    },
  },
});

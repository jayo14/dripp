import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      GET: async () => {
        const { listOrders } = await import("@/lib/api/orders");
        const orders = await listOrders();
        return json(orders);
      },
      POST: async ({ request }) => {
        const body = await request.json();
        const { placeOrder } = await import("@/lib/api/orders");
        const order = await placeOrder({ data: body });
        return json(order, { status: 201 });
      },
    },
  },
});

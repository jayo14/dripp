import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/tracking/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { getOrder } = await import("@/lib/api/orders");
        const order = await getOrder({ data: { id: params.id } });
        if (!order) return json({ error: "Not found" }, { status: 404 });
        return json({
          id: order.id,
          status: order.status,
          tracking: order.tracking,
          customer: order.customer,
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/orders/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { getOrder } = await import("@/lib/api/orders");
        const order = await getOrder({ data: { id: params.id } });
        if (!order) return json({ error: "Not found" }, { status: 404 });
        return json(order);
      },
      PUT: async ({ params, request }) => {
        const body = await request.json();
        const { updateOrderStatus } = await import("@/lib/api/orders");
        const order = await updateOrderStatus({ data: { id: params.id, status: body.status } });
        return json(order);
      },
    },
  },
});

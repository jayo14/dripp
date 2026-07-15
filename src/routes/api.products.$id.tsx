import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/products/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { getProduct } = await import("@/lib/api/products");
        const product = await getProduct({ data: { id: params.id } });
        if (!product) return json({ error: "Not found" }, { status: 404 });
        return json(product);
      },
      PUT: async ({ params, request }) => {
        const body = await request.json();
        const { updateProduct } = await import("@/lib/api/products");
        const updated = await updateProduct({ data: { id: params.id, ...body } });
        return json(updated);
      },
      DELETE: async ({ params }) => {
        const { deleteProduct } = await import("@/lib/api/products");
        await deleteProduct({ data: { id: params.id } });
        return json({ ok: true });
      },
    },
  },
});

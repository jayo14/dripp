import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () => {
        const { listProducts } = await import("@/lib/api/products");
        const products = await listProducts();
        return json(products);
      },
      POST: async ({ request }) => {
        const body = await request.json();
        const { createProduct } = await import("@/lib/api/products");
        const product = await createProduct({ data: body });
        return json(product, { status: 201 });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/brand")({
  server: {
    handlers: {
      GET: async () => {
        const { getBrandConfig } = await import("@/lib/api/brand");
        const config = await getBrandConfig();
        return json(config);
      },
      PUT: async ({ request }) => {
        const body = await request.json();
        const { updateBrandConfig } = await import("@/lib/api/brand");
        await updateBrandConfig({ data: body });
        return json({ ok: true });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { email } = await request.json() as { email: string };
        const { subscribeNewsletter, getNewsletter } = await import("@/lib/api/contact");
        const result = await subscribeNewsletter({ data: { email } });
        if (!result.ok) return json(result, { status: 409 });
        return json(result, { status: 201 });
      },
      GET: async () => {
        const { getNewsletter } = await import("@/lib/api/contact");
        const subs = await getNewsletter();
        return json(subs);
      },
    },
  },
});

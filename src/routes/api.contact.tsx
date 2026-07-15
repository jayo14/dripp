import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { name, email, message } = await request.json() as { name: string; email: string; message: string };
        const { submitContact } = await import("@/lib/api/contact");
        const result = await submitContact({ data: { name, email, message } });
        return json(result, { status: 201 });
      },
      GET: async () => {
        const { getContacts } = await import("@/lib/api/contact");
        const contacts = await getContacts();
        return json(contacts);
      },
    },
  },
});

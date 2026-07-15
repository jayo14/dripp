import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/auth/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { name, email, password } = await request.json() as { name: string; email: string; password: string };
        const { signup } = await import("@/lib/api/auth");
        const result = await signup({ data: { name, email, password } });
        if (!result.ok) return json(result, { status: 409 });
        return json(result, { status: 201 });
      },
    },
  },
});

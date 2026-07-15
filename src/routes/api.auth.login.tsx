import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { email, password } = await request.json() as { email: string; password: string };
        const { login } = await import("@/lib/api/auth");
        const result = await login({ data: { email, password } });
        if (!result.ok) return json(result, { status: 401 });
        return json(result);
      },
    },
  },
});

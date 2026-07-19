import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({ meta: [{ title: "Forgot Password — Dripp" }] }),
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
    toast.success("Reset link sent — check your email");
    setTimeout(() => navigate({ to: "/reset-password", search: { email } as never }), 1200);
  };

  return (
    <AuthLayout
      eyebrow="Recovery"
      title="Forgot password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="border border-border p-6 text-center">
          <p className="text-sm text-foreground">A reset link has been sent to</p>
          <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
          <p className="mt-4 text-[11px] text-muted-foreground">Redirecting to reset page…</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury py-6">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

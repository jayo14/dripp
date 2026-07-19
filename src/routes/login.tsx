import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign In — Dripp" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) return toast.error(res.error || "Login failed");
    toast.success("Welcome back");
    const isAdmin = useAuthStore.getState().isAdmin();
    navigate({ to: isAdmin ? "/admin" : "/" });
  };

  return (
    <AuthLayout
      eyebrow="Account"
      title="Sign in"
      subtitle="Access your orders, wishlist and saved details."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-luxury text-muted-foreground">Password</label>
            <Link to="/forgot-password" className="text-[11px] text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury py-6">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Demo admin: <span className="text-foreground">admin@dripp.com</span> / <span className="text-foreground">admin123</span>
        </p>
      </form>
    </AuthLayout>
  );
}

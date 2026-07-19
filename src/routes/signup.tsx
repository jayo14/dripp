import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create Account — Dripp" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);
    if (!res.ok) return toast.error(res.error || "Signup failed");
    toast.success("Welcome to Dripp");
    navigate({ to: "/" });
  };

  return (
    <AuthLayout
      eyebrow="Create Account"
      title="Join the atelier"
      subtitle="Track orders, save favourites and get early access to drops."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Full name</label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Obi" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Password</label>
          <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Confirm password</label>
          <PasswordInput required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury py-6">
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}

import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (s: Record<string, unknown>) => ({ email: (s.email as string) || "" }),
  head: () => ({ meta: [{ title: "Reset Password — Dripp" }] }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { email: initialEmail } = useSearch({ from: "/reset-password" });
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const res = await resetPassword(email, password);
    setLoading(false);
    if (!res.ok) return toast.error(res.error || "Reset failed");
    toast.success("Password updated — sign in with your new password");
    navigate({ to: "/login" });
  };

  return (
    <AuthLayout
      eyebrow="Recovery"
      title="Set new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link to="/login" className="text-foreground underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">New password</label>
          <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-luxury text-muted-foreground">Confirm password</label>
          <PasswordInput required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury py-6">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}

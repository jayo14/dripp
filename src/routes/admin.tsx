import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings as SettingsIcon, LogOut, Store } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBrandStore } from "@/store/useBrandStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Dripp" }] }),
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const brand = useBrandStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access admin");
      navigate({ to: "/login" });
    } else if (user.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const onLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-border bg-background lg:block">
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
            <div className="border-b border-border p-6">
              <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">Admin</p>
              <p className="mt-1 text-lg font-light">{brand.name}</p>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm transition",
                      active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border p-4 space-y-1">
              <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <Store className="h-4 w-4" />
                View storefront
              </Link>
              <button onClick={onLogout} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
              <div className="mt-4 border-t border-border pt-3 px-3">
                <p className="text-xs font-medium text-foreground">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="border-b border-border bg-background lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-medium">Admin · {brand.name}</p>
            <button onClick={onLogout} className="text-xs text-muted-foreground">Sign out</button>
          </div>
          <nav className="flex overflow-x-auto border-t border-border">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-xs uppercase tracking-luxury",
                    active ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

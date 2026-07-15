import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings as SettingsIcon, LogOut, Store, PanelLeftClose, PanelLeft, X } from "lucide-react";
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

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access admin");
      navigate({ to: "/login" });
    } else if (user.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user || user.role !== "admin") return null;

  const onLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const sidebarWidth = collapsed ? "64px" : "260px";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div
        className="grid grid-cols-1 lg:grid-cols-[var(--sidebar)_1fr] transition-[grid-template-columns] duration-200"
        style={{ "--sidebar": sidebarWidth } as React.CSSProperties}
      >
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-border bg-background lg:block">
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
            <div className={cn("border-b border-border", collapsed ? "p-4" : "p-6")}>
              {collapsed ? (
                <p className="text-center text-[10px] uppercase tracking-luxury text-muted-foreground">A</p>
              ) : (
                <>
                  <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">Admin</p>
                  <p className="mt-1 text-lg font-light">{brand.name}</p>
                </>
              )}
            </div>
            <nav className="flex-1 space-y-1 p-2">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                      collapsed && "justify-center px-2",
                      active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
            <div className={cn("border-t border-border space-y-1", collapsed ? "p-2" : "p-4")}>
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? "View storefront" : undefined}
              >
                <Store className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">View storefront</span>}
              </Link>
              <button
                onClick={onLogout}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? "Sign out" : undefined}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">Sign out</span>}
              </button>
              {!collapsed && (
                <div className="mt-4 border-t border-border pt-3 px-3">
                  <p className="text-xs font-medium text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user.email}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="relative z-50 flex h-full w-64 flex-col border-r border-border bg-background">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">Admin</p>
                  <p className="mt-1 text-lg font-light">{brand.name}</p>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
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
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
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
                <Link to="/" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Store className="h-4 w-4" />
                  View storefront
                </Link>
                <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
                <div className="mt-4 border-t border-border pt-3 px-3">
                  <p className="text-xs font-medium text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Mobile top nav */}
        <div className="border-b border-border bg-background lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="p-1 text-muted-foreground hover:text-foreground">
                <PanelLeft className="h-5 w-5" />
              </button>
              <p className="text-sm font-medium">Admin · {brand.name}</p>
            </div>
            <button onClick={onLogout} className="text-xs text-muted-foreground">Sign out</button>
          </div>
          <nav className="flex overflow-x-auto border-t border-border">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-3 text-xs uppercase tracking-luxury",
                    active ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="fixed bottom-4 left-[calc(var(--sidebar,260px)+0.75rem)] z-30 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:text-foreground lg:flex"
          style={{ left: `calc(${sidebarWidth} + 0.75rem)` } as React.CSSProperties}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>

        {/* Content */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { BrandThemeApplier } from "@/components/BrandThemeApplier";
import { AdminPanel } from "@/components/AdminPanel";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PromoBanner } from "@/components/sections/PromoBanner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Error 404</p>
        <h1 className="mt-4 text-7xl font-light text-foreground">Lost in the atelier</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has wandered off. Let's get you back.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="bg-foreground px-6 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">
            Back to Home
          </Link>
          <Link to="/shop" className="border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="bg-foreground px-4 py-2 text-sm text-background">Try again</button>
          <a href="/" className="border border-border px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Dripp — Premium Fashion Storefront" },
      { name: "description", content: "Reusable luxury fashion storefront for Nigerian brands. Shop ready-to-wear, accessories and more." },
      { property: "og:title", content: "Dripp — Premium Fashion Storefront" },
      { property: "og:description", content: "Reusable luxury fashion storefront for Nigerian brands." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  return (
    <QueryClientProvider client={queryClient}>
      <BrandThemeApplier />
      {!isAdmin && <PromoBanner />}
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "min-h-screen" : "min-h-[60vh] pb-20 md:pb-0"}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <CartDrawer />
      {!isAdmin && <WhatsAppButton />}
      <AdminPanel />
      {!isAdmin && <MobileBottomNav />}
    </QueryClientProvider>
  );
}

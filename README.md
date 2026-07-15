# dripp

A luxury fashion storefront demo built with TanStack Start (React + SSR).

## Features

- **Storefront** — product listing, detail pages with image gallery, color/size selectors, wishlist, cart drawer
- **Checkout** — 3-step checkout flow (Information → Delivery → Review) with WhatsApp order or dummy card payment
- **Order tracking** — real-time order status with visual timeline by order ID
- **Admin dashboard** — full-width collapsible sidebar, stats overview, recent orders, top products
- **Product management** — add/edit/delete products with image upload, color picker, size toggles
- **Order management** — update order statuses (pending → processing → shipped → delivered → cancelled)
- **Brand settings** — customizable store name, tagline, hero content, contact info, category/section visibility
- **Re-theming** — floating admin panel to switch audience presets and toggle dark mode
- **Responsive** — mobile-first design with full-screen forms on small screens

## Tech stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework (file-based routing, SSR)
- [TanStack Router](https://tanstack.com/router) — type-safe routing
- [TanStack Query](https://tanstack.com/query) — server-state management
- [Zustand](https://github.com/pmndrs/zustand) — client-state with localStorage persistence
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Framer Motion](https://framer.com/motion) — animations
- [Radix UI](https://www.radix-ui.com) — accessible primitives
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — form validation
- [Lucide](https://lucide.dev) — icons
- [Sonner](https://sonner.emilkowal.ski) — toast notifications
- [Vite](https://vitejs.dev) — build tool
- [Cloudflare](https://cloudflare.com) — deployment target

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin access

Navigate to `/admin` and sign in with:

- Email: `admin@dripp.com`
- Password: `admin123`

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/       # Reusable UI components
│   └── ui/           # Primitive UI components (Button, Input, etc.)
├── config/           # Theme presets and category definitions
├── data/             # Static mock data and type definitions
├── lib/              # Utilities (cn helper)
├── routes/           # TanStack Router file-based routes
├── store/            # Zustand stores (auth, brand, cart, products, orders)
└── styles.css        # Global styles and Tailwind imports
```

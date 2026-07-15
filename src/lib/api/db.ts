import { PRODUCTS, type Product } from "@/data/products";
import { MOCK_ORDERS, type OrderStatus } from "@/data/mockOrders";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface TrackingEvent {
  status: string;
  date: string;
  description: string;
}

export interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; address: string; city: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "whatsapp" | "card";
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  tracking: TrackingEvent[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSub {
  email: string;
  createdAt: string;
}

function buildTracking(status: OrderStatus, createdAt: string): TrackingEvent[] {
  const t = (offsetMs: number, s: string, desc: string) => ({
    status: s,
    date: new Date(new Date(createdAt).getTime() + offsetMs).toISOString(),
    description: desc,
  });
  const events: TrackingEvent[] = [t(0, "pending", "Order placed")];
  if (status === "cancelled") {
    events.push(t(1800000, "cancelled", "Order cancelled"));
    return events;
  }
  events.push(t(3600000, "processing", "Order confirmed and being prepared"));
  if (status === "shipped" || status === "delivered")
    events.push(t(86400000, "shipped", "Package shipped"));
  if (status === "delivered")
    events.push(t(259200000, "delivered", "Package delivered"));
  return events;
}

function mockToOrder(m: (typeof MOCK_ORDERS)[number]): Order {
  const now = new Date(m.date).toISOString();
  return {
    id: m.id,
    customer: { name: m.customer, email: m.email, phone: "", address: "", city: "" },
    items: Array.from({ length: m.items }, (_, i) => ({
      productId: `mock-${i}`,
      name: `Item ${i + 1}`,
      price: Math.round(m.total / m.items),
      size: "M",
      color: "Black",
      quantity: 1,
      image: "/assets/product-1.png",
    })),
    subtotal: m.total,
    shipping: 0,
    total: m.total,
    status: m.status,
    paymentMethod: "card" as const,
    paid: m.status !== "cancelled",
    createdAt: now,
    updatedAt: now,
    tracking: buildTracking(m.status, now),
  };
}

interface DbData {
  products: Product[];
  orders: Order[];
  users: { id: string; name: string; email: string; password: string; role: "admin" | "customer"; createdAt: string }[];
  newsletter: NewsletterSub[];
  contacts: ContactSubmission[];
}

const g = globalThis as { __drippDb?: DbData };

function init(): DbData {
  if (!g.__drippDb) {
    g.__drippDb = {
      products: PRODUCTS.map((p) => ({ ...p, images: [...p.images], colors: p.colors.map((c) => ({ ...c })), sizes: [...p.sizes], details: [...p.details] })),
      orders: MOCK_ORDERS.map(mockToOrder),
      users: [{ id: "admin-1", name: "Dripp Admin", email: "admin@dripp.com", password: "admin123", role: "admin", createdAt: new Date().toISOString() }],
      newsletter: [],
      contacts: [],
    };
  }
  return g.__drippDb;
}

export function getDb(): DbData {
  return init();
}

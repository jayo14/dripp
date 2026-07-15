import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderStatus } from "@/data/mockOrders";
import { MOCK_ORDERS } from "@/data/mockOrders";

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
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
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

let _counter = 0;
const genId = () => `DR-${Date.now().toString(36).toUpperCase()}-${++_counter}`;

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
    paymentMethod: "card",
    paid: m.status !== "cancelled",
    createdAt: now,
    updatedAt: now,
    tracking: buildTracking(m.status, now),
  };
}

const MOCK_ORDERS_CONVERTED = MOCK_ORDERS.map(mockToOrder);

interface OrderStore {
  orders: Order[];
  seed: () => void;
  placeOrder: (o: Omit<Order, "id" | "status" | "paid" | "createdAt" | "updatedAt" | "tracking">) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  getById: (id: string) => Order | undefined;
  getAll: () => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      seed: () => {
        if (get().orders.length === 0) {
          set({ orders: MOCK_ORDERS_CONVERTED });
        }
      },
      placeOrder: (input) => {
        const now = new Date().toISOString();
        const order: Order = {
          ...input,
          id: genId(),
          status: "pending",
          paid: input.paymentMethod === "card",
          createdAt: now,
          updatedAt: now,
          tracking: buildTracking("pending", now),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, status, updatedAt: new Date().toISOString(), tracking: buildTracking(status, o.createdAt) }
              : o
          ),
        })),
      getById: (id) => get().orders.find((o) => o.id === id),
      getAll: () => get().orders,
    }),
    { name: "dripp-orders", version: 1 }
  )
);

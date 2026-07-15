import { createServerFn } from "@tanstack/react-start";
import type { OrderStatus } from "@/data/mockOrders";
import type { Order, OrderItem } from "./db";

let _counter = 0;
const genId = () => `DR-${Date.now().toString(36).toUpperCase()}-${++_counter}`;

function buildTracking(status: OrderStatus, createdAt: string) {
  const t = (offsetMs: number, s: string, desc: string) => ({
    status: s,
    date: new Date(new Date(createdAt).getTime() + offsetMs).toISOString(),
    description: desc,
  });
  const events = [t(0, "pending", "Order placed")];
  if (status === "cancelled") { events.push(t(1800000, "cancelled", "Order cancelled")); return events; }
  events.push(t(3600000, "processing", "Order confirmed and being prepared"));
  if (status === "shipped" || status === "delivered") events.push(t(86400000, "shipped", "Package shipped"));
  if (status === "delivered") events.push(t(259200000, "delivered", "Package delivered"));
  return events;
}

export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("./db");
  return getDb().orders;
});

export const getOrder = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { id } = data as { id: string };
  const { getDb } = await import("./db");
  return getDb().orders.find((o) => o.id === id) || null;
});

export const placeOrder = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const input = data as {
    customer: { name: string; email: string; phone: string; address: string; city: string };
    items: OrderItem[]; subtotal: number; shipping: number; total: number; paymentMethod: "whatsapp" | "card";
  };
  const { getDb } = await import("./db");
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
  getDb().orders.unshift(order);
  return order;
});

export const updateOrderStatus = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { id, status } = data as { id: string; status: OrderStatus };
  const { getDb } = await import("./db");
  const db = getDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  const now = new Date().toISOString();
  order.status = status;
  order.updatedAt = now;
  order.tracking = buildTracking(status, order.createdAt);
  return order;
});

import { create } from "zustand";
import * as orderFn from "@/lib/api/orders";
import type { OrderStatus } from "@/data/mockOrders";
import type { Order, OrderItem } from "@/lib/api/db";

interface OrderStore {
  orders: Order[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  placeOrder: (input: {
    customer: { name: string; email: string; phone: string; address: string; city: string };
    items: OrderItem[]; subtotal: number; shipping: number; total: number; paymentMethod: "whatsapp" | "card";
  }) => Promise<Order>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  getById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  loading: false,
  fetchAll: async () => {
    set({ loading: true });
    const orders = await orderFn.listOrders();
    set({ orders, loading: false });
  },
  placeOrder: async (input) => {
    const order = await orderFn.placeOrder({ data: input });
    set((s) => ({ orders: [order, ...s.orders] }));
    return order;
  },
  updateStatus: async (id, status) => {
    const updated = await orderFn.updateOrderStatus({ data: { id, status } });
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? updated : o)) }));
  },
  getById: (id) => get().orders.find((o) => o.id === id),
}));

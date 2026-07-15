// ============================================================================
// MOCK ORDERS & CUSTOMERS — demo data for the admin dashboard.
// ============================================================================
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  items: number;
  date: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  location: string;
}

export const MOCK_ORDERS: AdminOrder[] = [
  { id: "DR-1042", customer: "Ada Obi", email: "ada@example.com", total: 385000, status: "delivered", items: 2, date: "2026-07-12" },
  { id: "DR-1041", customer: "Tunde Bakare", email: "tunde@example.com", total: 145000, status: "shipped", items: 1, date: "2026-07-11" },
  { id: "DR-1040", customer: "Zainab Musa", email: "zainab@example.com", total: 620000, status: "processing", items: 3, date: "2026-07-11" },
  { id: "DR-1039", customer: "Chidi Okafor", email: "chidi@example.com", total: 92000, status: "pending", items: 1, date: "2026-07-10" },
  { id: "DR-1038", customer: "Ngozi Eze", email: "ngozi@example.com", total: 285000, status: "delivered", items: 2, date: "2026-07-09" },
  { id: "DR-1037", customer: "Kunle Ade", email: "kunle@example.com", total: 178000, status: "cancelled", items: 1, date: "2026-07-08" },
  { id: "DR-1036", customer: "Amaka Nwosu", email: "amaka@example.com", total: 445000, status: "delivered", items: 3, date: "2026-07-07" },
  { id: "DR-1035", customer: "Bola Ojo", email: "bola@example.com", total: 210000, status: "shipped", items: 1, date: "2026-07-06" },
];

export const MOCK_CUSTOMERS: AdminCustomer[] = [
  { id: "c-1", name: "Ada Obi", email: "ada@example.com", orders: 8, spent: 2140000, joined: "2025-11-02", location: "Lagos" },
  { id: "c-2", name: "Tunde Bakare", email: "tunde@example.com", orders: 3, spent: 485000, joined: "2026-01-14", location: "Abuja" },
  { id: "c-3", name: "Zainab Musa", email: "zainab@example.com", orders: 12, spent: 3820000, joined: "2025-08-20", location: "Lagos" },
  { id: "c-4", name: "Chidi Okafor", email: "chidi@example.com", orders: 1, spent: 92000, joined: "2026-07-01", location: "Port Harcourt" },
  { id: "c-5", name: "Ngozi Eze", email: "ngozi@example.com", orders: 5, spent: 1290000, joined: "2026-02-18", location: "Enugu" },
  { id: "c-6", name: "Kunle Ade", email: "kunle@example.com", orders: 2, spent: 178000, joined: "2026-05-05", location: "Ibadan" },
];

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  processing: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200",
  delivered: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

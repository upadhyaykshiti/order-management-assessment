import type { MenuItem, Order, OrderStatus } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const body = await response.json();
      message = body.detail ?? message;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getMenu() {
  return request<MenuItem[]>("/api/menu");
}

export function getOrders() {
  return request<Order[]>("/api/orders");
}

export function getOrder(id: string | number) {
  return request<Order>(`/api/orders/${id}`);
}

export function createOrder(payload: {
  customer_name: string;
  delivery_address: string;
  phone: string;
  items: { menu_item_id: number; quantity: number }[];
}) {
  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return request<Order>(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteOrder(id: number) {
  return request<void>(`/api/orders/${id}`, {
    method: "DELETE",
  });
}

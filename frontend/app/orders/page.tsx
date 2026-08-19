"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <p className="eyebrow">HISTORY</p>
      <h1>Your Orders</h1>

      {loading && <div className="loading">Loading orders...</div>}

      {!loading && orders.length === 0 && (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <Link href="/" className="primary-button">
            Order Something
          </Link>
        </div>
      )}

      <div className="order-list">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="card order-list-item"
          >
            <div>
              <strong>Order #{order.id}</strong>
              <p>{order.items.map((item) => item.item_name).join(", ")}</p>
            </div>

            <div className="order-list-right">
              <span className={`badge status-${order.status.toLowerCase()}`}>
                {order.status.replaceAll("_", " ")}
              </span>
              <strong>₹{order.total_amount.toFixed(0)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

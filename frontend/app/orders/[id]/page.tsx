"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrder } from "@/lib/api";
import { OrderStatus } from "@/components/OrderStatus";
import type { Order } from "@/types";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    params.then(({ id: routeId }) => setId(routeId));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const load = async () => {
      try {
        const result = await getOrder(id);
        if (active) {
          setOrder(result);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load order.");
        }
      }
    };

    load();

    const interval = setInterval(() => {
      if (
        order?.status !== "DELIVERED" &&
        order?.status !== "CANCELLED"
      ) {
        load();
      }
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id, order?.status]);

  if (error) {
    return (
      <div className="container page">
        <div className="error-box">{error}</div>
        <Link href="/orders" className="primary-button">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="container page loading">Loading order...</div>;
  }

  return (
    <div className="container page narrow">
      <div className="order-header">
        <div>
          <p className="eyebrow">ORDER TRACKING</p>
          <h1>Order #{order.id}</h1>
          <p>Placed for {order.customer_name}</p>
        </div>

        <span className={`badge status-${order.status.toLowerCase()}`}>
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      <section className="card tracking-card">
        <OrderStatus status={order.status} />

        {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
          <p className="live-note">
            ● Updating automatically every 3 seconds
          </p>
        )}
      </section>

      <section className="card summary">
        <h2>Order Details</h2>

        {order.items.map((item) => (
          <div className="summary-row" key={item.id}>
            <span>
              {item.item_name} × {item.quantity}
            </span>
            <strong>₹{item.subtotal.toFixed(0)}</strong>
          </div>
        ))}

        <hr />

        <div className="summary-row total-row">
          <span>Total</span>
          <strong>₹{order.total_amount.toFixed(0)}</strong>
        </div>
      </section>

      <section className="card delivery-card">
        <h2>Delivery Information</h2>
        <p><strong>Name:</strong> {order.customer_name}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Address:</strong> {order.delivery_address}</p>
      </section>
    </div>
  );
}

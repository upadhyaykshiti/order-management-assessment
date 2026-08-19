"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear, hydrated } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) {
    return <div className="container page loading">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container page empty-state">
        <h1>Your cart is empty</h1>
        <Link href="/" className="primary-button">
          Browse Menu
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[0-9+ ()-]{7,20}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (address.trim().length < 5) {
      setError("Please enter your delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder({
        customer_name: name.trim(),
        delivery_address: address.trim(),
        phone: phone.trim(),
        items: items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      });

      clear();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page">
      <p className="eyebrow">CHECKOUT</p>
      <h1>Delivery details</h1>

      <div className="checkout-layout">
        <form className="card form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Phone number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
            />
          </label>

          <label>
            Delivery address
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House, street, city..."
              rows={5}
              required
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="primary-button full" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="card summary">
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>
                ₹{(item.price * item.quantity).toFixed(0)}
              </strong>
            </div>
          ))}

          <hr />

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{total.toFixed(0)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

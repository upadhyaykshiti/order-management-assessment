"use client";

import Link from "next/link";
import type { CartItem } from "@/types";

type Props = {
  items: CartItem[];
  total: number;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
};

export function CartView({
  items,
  total,
  updateQuantity,
  removeItem,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add something delicious from the menu.</p>
        <Link href="/" className="primary-button">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="stack">
        {items.map((item) => (
          <div className="cart-item card" key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <p>₹{item.price.toFixed(0)} each</p>
            </div>

            <div className="quantity">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>

            <strong>₹{(item.price * item.quantity).toFixed(0)}</strong>

            <button
              className="text-button danger"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <aside className="summary card">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>₹{total.toFixed(0)}</strong>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <strong>Free</strong>
        </div>
        <hr />
        <div className="summary-row total-row">
          <span>Total</span>
          <strong>₹{total.toFixed(0)}</strong>
        </div>
        <Link href="/checkout" className="primary-button full">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}

"use client";

import { CartView } from "@/components/CartView";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const cart = useCart();

  return (
    <div className="container page">
      <p className="eyebrow">YOUR ORDER</p>
      <h1>Shopping Cart</h1>
      <CartView
        items={cart.items}
        total={cart.total}
        updateQuantity={cart.updateQuantity}
        removeItem={cart.removeItem}
      />
    </div>
  );
}

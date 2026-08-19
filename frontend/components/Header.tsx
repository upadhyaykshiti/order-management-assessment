"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const { count } = useCart();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          QuickBite
        </Link>

        <nav className="nav">
          <Link href="/">Menu</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/cart" className="cart-link">
            Cart <span>{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MenuCard } from "../components/MenuCard";
import { getMenu } from "../lib/api";
import { useCart } from "../hooks/useCart";
import type { MenuItem } from "../types";

export default function HomePage() {
  const { addItem } = useCart();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMenu()
      .then(setMenu)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <section className="hero">
        <div>
          <p className="eyebrow">FAST • FRESH • SIMPLE</p>
          <h1>What are you craving today?</h1>
          <p>
            Choose your favourites, check out in seconds and track your order
            from kitchen to doorstep.
          </p>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">OUR MENU</p>
          <h2>Popular today</h2>
        </div>
      </div>

      {loading && <div className="loading">Loading menu...</div>}
      {error && <div className="error-box">{error}</div>}

      {!loading && !error && (
        <section className="menu-grid">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addItem} />
          ))}
        </section>
      )}
    </div>
  );
}

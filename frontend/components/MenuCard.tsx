"use client";

import Image from "next/image";
import type { MenuItem } from "@/types";

type Props = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export function MenuCard({ item, onAdd }: Props) {
    console.log("MENU ITEM:", item.name, item.image_url);

  return (

    <article className="card menu-card">
      <div className="image-wrap">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="food-image"
        />
      </div>
      

      <div className="card-body">
        <div className="row-between">
          <h2>{item.name}</h2>
          <strong>₹{item.price.toFixed(0)}</strong>
        </div>

        <p>{item.description}</p>

        <button
          className="primary-button full"
          onClick={() => onAdd(item)}
          disabled={!item.is_available}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

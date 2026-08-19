// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { CartItem, MenuItem } from "@/types";

// const STORAGE_KEY = "food-order-cart";

// export function useCart() {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem(STORAGE_KEY);
//       if (stored) setItems(JSON.parse(stored));
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (hydrated) {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
//     }
//   }, [items, hydrated]);

//   const addItem = (menuItem: MenuItem) => {
//     setItems((current) => {
//       const existing = current.find((item) => item.id === menuItem.id);

//       if (existing) {
//         return current.map((item) =>
//           item.id === menuItem.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item,
//         );
//       }

//       return [...current, { ...menuItem, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id: number, quantity: number) => {
//     if (quantity <= 0) {
//       setItems((current) => current.filter((item) => item.id !== id));
//       return;
//     }

//     setItems((current) =>
//       current.map((item) =>
//         item.id === id ? { ...item, quantity } : item,
//       ),
//     );
//   };

//   const removeItem = (id: number) => {
//     setItems((current) => current.filter((item) => item.id !== id));
//   };

//   const clear = () => setItems([]);

//   const total = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const count = useMemo(
//     () => items.reduce((sum, item) => sum + item.quantity, 0),
//     [items],
//   );

//   return {
//     items,
//     total,
//     count,
//     addItem,
//     updateQuantity,
//     removeItem,
//     clear,
//     hydrated,
//   };
// }



"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CartItem, MenuItem } from "@/types";

const STORAGE_KEY = "food-order-cart";

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (menuItem: MenuItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items, hydrated]);

  const addItem = (menuItem: MenuItem) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.id === menuItem.id,
      );

      if (existing) {
        return current.map((item) =>
          item.id === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          ...menuItem,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (
    id: number,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      setItems((current) =>
        current.filter((item) => item.id !== id),
      );
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const clear = () => {
    setItems([]);
  };

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0,
      ),
    [items],
  );

  const count = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
    [items],
  );

  const value: CartContextValue = {
    items,
    total,
    count,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    hydrated,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}
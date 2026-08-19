"use client";

import type { OrderStatus } from "@/types";

const steps: { value: OrderStatus; label: string }[] = [
  { value: "RECEIVED", label: "Order Received" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
];

export function OrderStatus({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return <div className="cancelled-status">Order Cancelled</div>;
  }

  const currentIndex = steps.findIndex((step) => step.value === status);

  return (
    <div className="timeline">
      {steps.map((step, index) => (
        <div
          key={step.value}
          className={`timeline-step ${
            index <= currentIndex ? "completed" : ""
          }`}
        >
          <div className="timeline-dot">
            {index < currentIndex ? "✓" : index === currentIndex ? "●" : ""}
          </div>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

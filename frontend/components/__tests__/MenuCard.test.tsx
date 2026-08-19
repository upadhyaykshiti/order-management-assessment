import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MenuCard } from "@/components/MenuCard";

const item = {
  id: 1,
  name: "Pizza",
  description: "Cheesy pizza",
  price: 299,
  image_url: "https://images.unsplash.com/test",
  is_available: true,
};

describe("MenuCard", () => {
  it("renders item information", () => {
    render(<MenuCard item={item} onAdd={vi.fn()} />);

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Cheesy pizza")).toBeInTheDocument();
    expect(screen.getByText("₹299")).toBeInTheDocument();
  });

  it("calls onAdd when clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<MenuCard item={item} onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(onAdd).toHaveBeenCalledWith(item);
  });
});

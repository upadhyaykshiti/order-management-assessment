export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
};

export type OrderItem = {
  id: number;
  menu_item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

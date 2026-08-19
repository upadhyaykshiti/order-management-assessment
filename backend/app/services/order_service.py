from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.menu_item import MenuItem
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderCreate


ALLOWED_TRANSITIONS = {
    OrderStatus.RECEIVED: {OrderStatus.PREPARING, OrderStatus.CANCELLED},
    OrderStatus.PREPARING: {OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED},
    OrderStatus.OUT_FOR_DELIVERY: {OrderStatus.DELIVERED},
    OrderStatus.DELIVERED: set(),
    OrderStatus.CANCELLED: set(),
}


def create_order(db: Session, payload: OrderCreate) -> Order:
    requested_ids = [item.menu_item_id for item in payload.items]
    menu_items = db.scalars(
        select(MenuItem).where(MenuItem.id.in_(requested_ids))
    ).all()

    menu_by_id = {item.id: item for item in menu_items}

    missing = [item_id for item_id in requested_ids if item_id not in menu_by_id]
    if missing:
        raise ValueError(f"Menu item(s) not found: {missing}")

    order = Order(
        customer_name=payload.customer_name,
        delivery_address=payload.delivery_address,
        phone=payload.phone,
        status=OrderStatus.RECEIVED.value,
        total_amount=0,
    )

    total = 0.0

    for requested in payload.items:
        menu = menu_by_id[requested.menu_item_id]

        if not menu.is_available:
            raise ValueError(f"Menu item '{menu.name}' is unavailable")

        subtotal = round(menu.price * requested.quantity, 2)
        total += subtotal

        order.items.append(
            OrderItem(
                menu_item_id=menu.id,
                item_name=menu.name,
                quantity=requested.quantity,
                unit_price=menu.price,
                subtotal=subtotal,
            )
        )

    order.total_amount = round(total, 2)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_order(db: Session, order_id: int) -> Order | None:
    return db.get(Order, order_id)


def list_orders(db: Session) -> list[Order]:
    return list(
        db.scalars(
            select(Order).order_by(Order.created_at.desc())
        ).all()
    )


def update_order_status(
    db: Session, order: Order, new_status: OrderStatus
) -> Order:
    current = OrderStatus(order.status)

    if new_status == current:
        return order

    if new_status not in ALLOWED_TRANSITIONS[current]:
        raise ValueError(
            f"Invalid status transition: {current.value} -> {new_status.value}"
        )

    order.status = new_status.value
    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order: Order) -> None:
    db.delete(order)
    db.commit()

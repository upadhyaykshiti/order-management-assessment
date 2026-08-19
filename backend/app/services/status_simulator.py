import threading
import time

from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import SessionLocal
from app.models.order import OrderStatus
from app.services.order_service import update_order_status


def _advance_order(order_id: int) -> None:
    statuses = [
        OrderStatus.PREPARING,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
    ]

    for status in statuses:
        time.sleep(settings.status_delay_seconds)

        db: Session = SessionLocal()
        try:
            from app.services.order_service import get_order

            order = get_order(db, order_id)
            if not order:
                return

            current = OrderStatus(order.status)

            # Stop if a user cancelled the order or it was manually advanced.
            if current == OrderStatus.CANCELLED:
                return

            if current == status:
                continue

            try:
                update_order_status(db, order, status)
            except ValueError:
                return
        finally:
            db.close()


def start_status_simulation(order_id: int) -> None:
    thread = threading.Thread(
        target=_advance_order,
        args=(order_id,),
        daemon=True,
    )
    thread.start()

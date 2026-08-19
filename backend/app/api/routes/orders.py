from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import OrderStatus
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.order_service import (
    create_order,
    delete_order,
    get_order,
    list_orders,
    update_order_status,
)
from app.services.status_simulator import start_status_simulation

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order_endpoint(
    payload: OrderCreate,
    db: Session = Depends(get_db),
):
    try:
        order = create_order(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    start_status_simulation(order.id)
    return order


@router.get("", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return list_orders(db)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_status_endpoint(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    order = get_order(db, order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        return update_order_status(db, order, payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    delete_order(db, order)
    return None

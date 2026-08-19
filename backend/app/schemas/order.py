from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    menu_item_id: int = Field(gt=0)
    quantity: int = Field(gt=0, le=50)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    delivery_address: str = Field(min_length=5, max_length=500)
    phone: str = Field(min_length=7, max_length=30)
    items: list[OrderItemCreate] = Field(min_length=1, max_length=50)

    @field_validator("customer_name", "delivery_address", "phone")
    @classmethod
    def strip_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Value cannot be empty")
        return value


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_item_id: int
    item_name: str
    quantity: int
    unit_price: float
    subtotal: float


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    delivery_address: str
    phone: str
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse]

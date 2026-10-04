from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class OrderItemResponse(BaseModel):
    id: int
    food_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
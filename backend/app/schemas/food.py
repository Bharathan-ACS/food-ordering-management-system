from pydantic import BaseModel
from decimal import Decimal


class FoodCreate(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    category_id: int
    is_available: bool = True


class FoodUpdate(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    category_id: int
    is_available: bool = True


class FoodResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: Decimal
    category_id: int
    is_available: bool

    class Config:
        from_attributes = True
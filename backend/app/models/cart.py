from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    UniqueConstraint,
    DateTime
)
from sqlalchemy.sql import func

from app.db.database import Base


class Cart(Base):
    __tablename__ = "carts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    cart_id = Column(
        Integer,
        ForeignKey("carts.id"),
        nullable=False
    )

    food_id = Column(
        Integer,
        ForeignKey("foods.id"),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=1
    )

    __table_args__ = (
        UniqueConstraint(
            "cart_id",
            "food_id",
            name="unique_cart_food"
        ),
    )
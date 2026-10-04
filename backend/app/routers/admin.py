from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.order import Order
from app.core.dependencies import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/customers")
def get_customers(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    customers = db.query(User).filter(
        User.role.ilike("customer")
    ).all()

    return [
        {
            "id": customer.id,
            "username": customer.username,
            "email": customer.email,
            "is_active": customer.is_active,
            "created_at": customer.created_at
        }
        for customer in customers
    ]


@router.get("/orders")
def get_all_orders(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).all()

    return [
        {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at
        }
        for order in orders
    ]


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    allowed_statuses = [
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
    ]

    status = status.upper()

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid order status"
        )

    order.status = status

    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully",
        "order_id": order.id,
        "status": order.status
    }
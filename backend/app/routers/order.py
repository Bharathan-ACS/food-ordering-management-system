from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.food import Food
from app.models.order import Order, OrderItem
from app.core.dependencies import get_current_user
from app.schemas.order import OrderResponse


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post(
    "/",
    response_model=OrderResponse,
    status_code=201
)
def place_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find user's cart
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    # Get cart items
    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total_amount = 0
    order_items_data = []

    # Calculate total
    for cart_item in cart_items:

        food = db.query(Food).filter(
            Food.id == cart_item.food_id
        ).first()

        if not food:
            raise HTTPException(
                status_code=404,
                detail=f"Food with ID {cart_item.food_id} not found"
            )

        if not food.is_available:
            raise HTTPException(
                status_code=400,
                detail=f"{food.name} is not available"
            )

        unit_price = food.price
        subtotal = unit_price * cart_item.quantity

        total_amount += subtotal

        order_items_data.append({
            "food_id": food.id,
            "quantity": cart_item.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal
        })

    # Create order
    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="PLACED"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create order items
    for item in order_items_data:

        order_item = OrderItem(
            order_id=new_order.id,
            food_id=item["food_id"],
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            subtotal=item["subtotal"]
        )

        db.add(order_item)

    # Clear cart
    for cart_item in cart_items:
        db.delete(cart_item)

    db.commit()
    db.refresh(new_order)

    return new_order

@router.get("/", response_model=list[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(
        Order.created_at.desc()
    ).all()

    return orders
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.cart import Cart, CartItem
from app.models.food import Food
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate
)
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


# Get current user's cart
@router.get("/")
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    cart_data = []

    total = 0

    for item in items:
        food = db.query(Food).filter(
            Food.id == item.food_id
        ).first()

        if food:
            subtotal = float(food.price) * item.quantity
            total += subtotal

            cart_data.append({
                "id": item.id,
                "food_id": food.id,
                "name": food.name,
                "price": float(food.price),
                "quantity": item.quantity,
                "subtotal": subtotal
            })

    return {
        "cart_id": cart.id,
        "items": cart_data,
        "total": total
    }


# Add food to cart
@router.post("/items")
def add_to_cart(
    cart_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    food = db.query(Food).filter(
        Food.id == cart_data.food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    if not food.is_available:
        raise HTTPException(
            status_code=400,
            detail="Food is not available"
        )

    if cart_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.food_id == cart_data.food_id
    ).first()

    if cart_item:
        cart_item.quantity += cart_data.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            food_id=cart_data.food_id,
            quantity=cart_data.quantity
        )
        db.add(cart_item)

    db.commit()

    return {
        "message": "Food added to cart successfully"
    }


# Update cart item quantity
@router.put("/items/{item_id}")
def update_cart_item(
    item_id: int,
    cart_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if cart_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    cart_item.quantity = cart_data.quantity

    db.commit()

    return {
        "message": "Cart item updated successfully"
    }


# Remove item from cart
@router.delete("/items/{item_id}")
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(cart_item)
    db.commit()

    return {
        "message": "Item removed from cart successfully"
    }
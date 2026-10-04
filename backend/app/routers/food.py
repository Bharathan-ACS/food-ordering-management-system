from app.core.dependencies import get_current_admin
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.models.order import OrderItem
from app.models.cart import CartItem

from app.db.database import get_db
from app.models.food import Food
from app.models.category import Category
from app.schemas.food import FoodCreate, FoodUpdate, FoodResponse

router = APIRouter(
    prefix="/foods",
    tags=["Foods"]
)


# GET all foods
@router.get("/", response_model=list[FoodResponse])
def get_foods(db: Session = Depends(get_db)):
    foods = db.query(Food).all()
    return foods


# GET food by ID
@router.get("/{food_id}", response_model=FoodResponse)
def get_food(food_id: int, db: Session = Depends(get_db)):
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    return food


# CREATE food
@router.post("/", response_model=FoodResponse, status_code=201)
def create_food(
    food_data: FoodCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Check category exists
    category = db.query(Category).filter(
        Category.id == food_data.category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    new_food = Food(
        name=food_data.name,
        description=food_data.description,
        price=food_data.price,
        category_id=food_data.category_id,
        is_available=food_data.is_available
    )

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return new_food


# UPDATE food
@router.put("/{food_id}", response_model=FoodResponse)
def update_food(
    food_id: int,
    food_data: FoodUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    # Check category exists
    category = db.query(Category).filter(
        Category.id == food_data.category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    food.name = food_data.name
    food.description = food_data.description
    food.price = food_data.price
    food.category_id = food_data.category_id
    food.is_available = food_data.is_available

    db.commit()
    db.refresh(food)

    return food


# DELETE food
@router.delete("/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    # Check whether food is used in orders
    order_item = db.query(OrderItem).filter(
        OrderItem.food_id == food_id
    ).first()

    if order_item:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete food because it is used in an order. Mark it as unavailable instead."
        )

    # Check whether food is currently in any cart
    cart_item = db.query(CartItem).filter(
        CartItem.food_id == food_id
    ).first()

    if cart_item:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete food because it is currently in a cart."
        )

    db.delete(food)
    db.commit()

    return {
        "message": "Food deleted successfully"
    }
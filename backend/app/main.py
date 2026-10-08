from fastapi import FastAPI
from sqlalchemy import text
from app.routers.auth import router as auth_router
from app.db.database import engine,Base
from app.models import User, Category, Food, Cart, CartItem, Order, OrderItem
from fastapi.middleware.cors import CORSMiddleware
from app.routers.category import router as category_router
from app.routers.auth import router as auth_router
from app.routers.food import router as food_router
from app.routers.cart import router as cart_router
from app.routers.order import router as order_router
from app.routers.admin import router as admin_router


Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://food-ordering-management-s-git-2af216-bharathan-a-c-ss-projects.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(food_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(admin_router)

@app.get("/")
def home():
    return {"message": "Welcome to the Food Ordering API!"}

@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database":"conneted","result": result.scalar()}
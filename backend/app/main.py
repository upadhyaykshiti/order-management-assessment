from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.menu import router as menu_router
from app.api.routes.orders import router as orders_router
from app.core.config import settings
from app.database import Base, SessionLocal, engine
from app.models.menu_item import MenuItem



SEED_MENU = [
    {
        "name": "Margherita Pizza",
        "description": "Tomato, mozzarella and fresh basil.",
        "price": 299,
        "image_url": "/images/pizza.jpg",
    },
    {
        "name": "Classic Cheeseburger",
        "description": "Juicy beef patty, cheddar, lettuce and house sauce.",
        "price": 249,
        "image_url": "/images/burger.jpg",
    },
    {
        "name": "Chicken Biryani",
        "description": "Aromatic basmati rice with spiced chicken.",
        "price": 279,
        "image_url": "/images/chicken-biryani.jpg",
    },
    {
        "name": "Veggie Wrap",
        "description": "Grilled vegetables, lettuce and creamy dressing.",
        "price": 179,
        "image_url": "/images/veggie-rolls.jpg",
    },
    {
        "name": "French Fries",
        "description": "Crispy golden fries with a pinch of sea salt.",
        "price": 129,
        "image_url": "/images/french_fries.jpg",
    },
    {
        "name": "Chocolate Brownie",
        "description": "Warm fudgy brownie with rich chocolate flavour.",
        "price": 149,
        "image_url": "/images/brownie.jpg",
    },
]

# def seed_menu() -> None:
#     db = SessionLocal()
#     try:
#         if db.query(MenuItem).count() == 0:
#             db.add_all([MenuItem(**item) for item in SEED_MENU])
#             db.commit()
#     finally:
#         db.close()

def seed_menu() -> None:
    db = SessionLocal()
    try:
        existing_items = {
            item.name: item
            for item in db.query(MenuItem).all()
        }

        for seed_item in SEED_MENU:
            existing = existing_items.get(seed_item["name"])

            if existing:
                existing.description = seed_item["description"]
                existing.price = seed_item["price"]
                existing.image_url = seed_item["image_url"]
            else:
                db.add(MenuItem(**seed_item))

        db.commit()
    finally:
        db.close()


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     Base.metadata.create_all(bind=engine)
#     seed_menu()
#     yield

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    if os.getenv("TESTING") != "1":
        seed_menu()

    yield


app = FastAPI(
    title="Food Delivery Order Management API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu_router)
app.include_router(orders_router)


@app.get("/health")
def health():
    return {"status": "ok"}

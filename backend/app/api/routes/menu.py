from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.menu_item import MenuItem
from app.schemas.menu import MenuItemResponse

router = APIRouter(prefix="/api/menu", tags=["Menu"])


@router.get("", response_model=list[MenuItemResponse])
def get_menu(db: Session = Depends(get_db)):
    return list(
        db.scalars(
            select(MenuItem)
            .where(MenuItem.is_available.is_(True))
            .order_by(MenuItem.id)
        ).all()
    )


@router.get("/{menu_item_id}", response_model=MenuItemResponse)
def get_menu_item(menu_item_id: int, db: Session = Depends(get_db)):
    item = db.get(MenuItem, menu_item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    return item

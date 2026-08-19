import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Configure test DB before importing the app.
fd, db_path = tempfile.mkstemp(suffix=".db")
os.close(fd)
os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
os.environ["STATUS_DELAY_SECONDS"] = "999999"
os.environ["TESTING"] = "1"


from app.database import Base, get_db
from app.main import app


engine = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(bind=engine)


@pytest.fixture()
def client():
    Base.metadata.create_all(bind=engine)

    from app.models.menu_item import MenuItem

    db = TestingSessionLocal()
    if db.query(MenuItem).count() == 0:
        db.add_all(
            [
                MenuItem(
                    name="Test Pizza",
                    description="Test description",
                    price=100,
                    image_url="https://example.com/pizza.jpg",
                    is_available=True,
                ),
                MenuItem(
                    name="Unavailable Item",
                    description="Unavailable",
                    price=50,
                    image_url="https://example.com/no.jpg",
                    is_available=False,
                ),
            ]
        )
        db.commit()
    db.close()

    def override_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

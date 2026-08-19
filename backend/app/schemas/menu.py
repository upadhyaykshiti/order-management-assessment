from pydantic import BaseModel, ConfigDict, Field


class MenuItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    price: float = Field(ge=0)
    image_url: str
    is_available: bool

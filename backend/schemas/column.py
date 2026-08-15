from pydantic import BaseModel, Field


class ColumnCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    position: int = Field(ge=1)


class ColumnResponse(BaseModel):
    id: int
    board_id: int
    name: str
    position: int

    model_config = {
        "from_attributes": True
    }
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


Priority = Literal["Low", "Medium", "High"]


class TaskCreate(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True
    )
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    priority: Priority = "Medium"
    column_id: int


class TaskUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    priority: Priority


class TaskMove(BaseModel):
    column_id: int


class TaskResponse(BaseModel):
    id: int
    column_id: int
    title: str
    description: str | None
    priority: Priority
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
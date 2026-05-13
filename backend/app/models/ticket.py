from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PyObjectId(str):
    pass


class TicketModel(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    domain: str
    priority: str
    status: str = "Open"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

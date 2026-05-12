from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from app.models.ticket import DomainEnum, PriorityEnum, StatusEnum


class TicketCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, description="Ticket title")
    description: str = Field(..., min_length=5, max_length=2000, description="Ticket description")
    domain: DomainEnum
    priority: PriorityEnum
    status: StatusEnum = StatusEnum.Open


class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, min_length=5, max_length=2000)
    domain: Optional[DomainEnum] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    domain: DomainEnum
    priority: PriorityEnum
    status: StatusEnum
    created_at: datetime

    model_config = {"from_attributes": True}


class SummaryResponse(BaseModel):
    total_tickets: int
    tickets_per_domain: Dict[str, int]
    tickets_per_status: Dict[str, int]
    high_priority_count: int

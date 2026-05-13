from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional
from datetime import datetime

VALID_DOMAINS = ["Engineering", "DevOps", "HR", "IT", "Finance"]
VALID_PRIORITIES = ["Low", "Medium", "High", "Critical"]
VALID_STATUSES = ["Open", "In Progress", "Closed"]


class TicketCreate(BaseModel):
    title: str
    description: str
    domain: str
    priority: str
    status: Optional[str] = "Open"

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Title is required")
        if len(v) < 3:
            raise ValueError("Title must be at least 3 characters")
        if len(v) > 255:
            raise ValueError("Title must be under 255 characters")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Description is required")
        if len(v) < 10:
            raise ValueError("Description must be at least 10 characters")
        return v

    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v):
        if v not in VALID_DOMAINS:
            raise ValueError(f"Domain must be one of: {', '.join(VALID_DOMAINS)}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {', '.join(VALID_PRIORITIES)}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) < 3:
                raise ValueError("Title must be at least 3 characters")
        return v

    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v):
        if v is not None and v not in VALID_DOMAINS:
            raise ValueError(f"Domain must be one of: {', '.join(VALID_DOMAINS)}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v is not None and v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {', '.join(VALID_PRIORITIES)}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    domain: str
    priority: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class SummaryResponse(BaseModel):
    total_tickets: int
    tickets_per_domain: dict
    tickets_per_status: dict
    tickets_per_priority: dict
    high_priority_count: int
    open_count: int
    closed_count: int
    in_progress_count: int

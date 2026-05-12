from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from app.database.db import Base
import enum


class DomainEnum(str, enum.Enum):
    Engineering = "Engineering"
    DevOps = "DevOps"
    HR = "HR"
    IT = "IT"
    Finance = "Finance"


class PriorityEnum(str, enum.Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"
    Critical = "Critical"


class StatusEnum(str, enum.Enum):
    Open = "Open"
    InProgress = "In Progress"
    Closed = "Closed"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=False)
    domain = Column(SAEnum(DomainEnum), nullable=False)
    priority = Column(SAEnum(PriorityEnum), nullable=False)
    status = Column(SAEnum(StatusEnum), nullable=False, default=StatusEnum.Open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

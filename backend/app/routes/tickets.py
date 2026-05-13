from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.db import get_database
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, SummaryResponse
from app.services import ticket_service

router = APIRouter(prefix="/tickets", tags=["Tickets"])


def get_db() -> AsyncIOMotorDatabase:
    return get_database()


@router.get("/summary", response_model=SummaryResponse)
async def get_summary(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await ticket_service.get_summary(db)


@router.get("/", response_model=List[TicketResponse])
async def list_tickets(
    domain: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await ticket_service.get_all_tickets(db, domain, priority, status, search)


@router.post("/", response_model=TicketResponse, status_code=201)
async def create_ticket(
    ticket: TicketCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await ticket_service.create_ticket(db, ticket)


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: int,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await ticket_service.get_ticket_by_id(db, ticket_id)


@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: int,
    data: TicketUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await ticket_service.update_ticket(db, ticket_id, data)


@router.delete("/{ticket_id}")
async def delete_ticket(
    ticket_id: int,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await ticket_service.delete_ticket(db, ticket_id)

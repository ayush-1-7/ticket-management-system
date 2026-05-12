from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.db import get_db
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, SummaryResponse
from app.services import ticket_service

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db)):
    """Get analytics summary of all tickets"""
    return ticket_service.get_summary(db)


@router.get("/", response_model=List[TicketResponse])
def list_tickets(
    domain: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all tickets with optional filters"""
    return ticket_service.get_all_tickets(db, domain, priority, status, search)


@router.post("/", response_model=TicketResponse, status_code=201)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    """Create a new ticket"""
    return ticket_service.create_ticket(db, ticket)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Get a single ticket by ID"""
    return ticket_service.get_ticket_by_id(db, ticket_id)


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int, data: TicketUpdate, db: Session = Depends(get_db)
):
    """Update a ticket"""
    return ticket_service.update_ticket(db, ticket_id, data)


@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Delete a ticket permanently"""
    return ticket_service.delete_ticket(db, ticket_id)

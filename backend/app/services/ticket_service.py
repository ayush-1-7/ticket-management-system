from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate
from fastapi import HTTPException
from typing import Optional, List

def create_ticket(db: Session, ticket_data: TicketCreate) -> Ticket:
    ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        domain=ticket_data.domain,
        priority=ticket_data.priority,
        status=ticket_data.status or "Open"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

def get_all_tickets(
    db: Session,
    domain: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Ticket]:
    query = db.query(Ticket)
    if domain:
        query = query.filter(Ticket.domain == domain)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if status:
        query = query.filter(Ticket.status == status)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Ticket.title.ilike(search_filter)) | 
            (Ticket.description.ilike(search_filter))
        )
    return query.order_by(Ticket.created_at.desc()).all()

def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket with id {ticket_id} not found")
    return ticket

def update_ticket(db: Session, ticket_id: int, update_data: TicketUpdate) -> Ticket:
    ticket = get_ticket_by_id(db, ticket_id)
    update_dict = update_data.dict(exclude_unset=True)
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields provided for update")
    for field, value in update_dict.items():
        setattr(ticket, field, value)
    db.commit()
    db.refresh(ticket)
    return ticket

def delete_ticket(db: Session, ticket_id: int) -> dict:
    ticket = get_ticket_by_id(db, ticket_id)
    db.delete(ticket)
    db.commit()
    return {"message": f"Ticket {ticket_id} deleted successfully"}

def get_summary(db: Session) -> dict:
    total = db.query(Ticket).count()
    
    domains = ["Engineering", "DevOps", "HR", "IT", "Finance"]
    per_domain = {}
    for domain in domains:
        count = db.query(Ticket).filter(Ticket.domain == domain).count()
        per_domain[domain] = count
    
    statuses = ["Open", "In Progress", "Closed"]
    per_status = {}
    for status in statuses:
        count = db.query(Ticket).filter(Ticket.status == status).count()
        per_status[status] = count
    
    high_priority_count = db.query(Ticket).filter(
        Ticket.priority.in_(["High", "Critical"])
    ).count()
    
    return {
        "total_tickets": total,
        "tickets_per_domain": per_domain,
        "tickets_per_status": per_status,
        "high_priority_count": high_priority_count
    }

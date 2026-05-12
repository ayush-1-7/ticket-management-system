from sqlalchemy.orm import Session
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate
from fastapi import HTTPException
from typing import Optional, List

DOMAINS = ["Engineering", "DevOps", "HR", "IT", "Finance"]
PRIORITIES = ["Low", "Medium", "High", "Critical"]
STATUSES = ["Open", "In Progress", "Closed"]


def create_ticket(db: Session, data: TicketCreate) -> Ticket:
    ticket = Ticket(
        title=data.title,
        description=data.description,
        domain=data.domain,
        priority=data.priority,
        status=data.status or "Open",
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
    search: Optional[str] = None,
) -> List[Ticket]:
    query = db.query(Ticket)
    if domain:
        query = query.filter(Ticket.domain == domain)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if status:
        query = query.filter(Ticket.status == status)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Ticket.title.ilike(search_term) | Ticket.description.ilike(search_term)
        )
    return query.order_by(Ticket.created_at.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket #{ticket_id} not found",
        )
    return ticket


def update_ticket(db: Session, ticket_id: int, data: TicketUpdate) -> Ticket:
    ticket = get_ticket_by_id(db, ticket_id)
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No update fields provided")
    for key, value in updates.items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket_id: int) -> dict:
    ticket = get_ticket_by_id(db, ticket_id)
    db.delete(ticket)
    db.commit()
    return {"success": True, "message": f"Ticket #{ticket_id} deleted successfully"}


def get_summary(db: Session) -> dict:
    total = db.query(Ticket).count()

    per_domain = {
        d: db.query(Ticket).filter(Ticket.domain == d).count()
        for d in DOMAINS
    }
    per_status = {
        s: db.query(Ticket).filter(Ticket.status == s).count()
        for s in STATUSES
    }
    per_priority = {
        p: db.query(Ticket).filter(Ticket.priority == p).count()
        for p in PRIORITIES
    }

    high_priority_count = (
        db.query(Ticket)
        .filter(Ticket.priority.in_(["High", "Critical"]))
        .count()
    )

    return {
        "total_tickets": total,
        "tickets_per_domain": per_domain,
        "tickets_per_status": per_status,
        "tickets_per_priority": per_priority,
        "high_priority_count": high_priority_count,
        "open_count": per_status.get("Open", 0),
        "closed_count": per_status.get("Closed", 0),
        "in_progress_count": per_status.get("In Progress", 0),
    }

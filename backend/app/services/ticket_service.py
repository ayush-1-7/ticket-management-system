from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from fastapi import HTTPException
from typing import Optional, List
from app.schemas.ticket import TicketCreate, TicketUpdate

DOMAINS = ["Engineering", "DevOps", "HR", "IT", "Finance"]
PRIORITIES = ["Low", "Medium", "High", "Critical"]
STATUSES = ["Open", "In Progress", "Closed"]

COLLECTION = "tickets"


async def get_next_id(db: AsyncIOMotorDatabase) -> int:
    result = await db["counters"].find_one_and_update(
        {"_id": "ticket_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    return result["seq"]


def ticket_from_doc(doc: dict) -> dict:
    if doc is None:
        return None
    return {
        "id": doc["id"],
        "title": doc["title"],
        "description": doc["description"],
        "domain": doc["domain"],
        "priority": doc["priority"],
        "status": doc["status"],
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }


async def create_ticket(db: AsyncIOMotorDatabase, data: TicketCreate) -> dict:
    ticket_id = await get_next_id(db)
    now = datetime.now(timezone.utc)
    doc = {
        "id": ticket_id,
        "title": data.title,
        "description": data.description,
        "domain": data.domain,
        "priority": data.priority,
        "status": data.status or "Open",
        "created_at": now,
        "updated_at": now,
    }
    await db[COLLECTION].insert_one(doc)
    return ticket_from_doc(doc)


async def get_all_tickets(
    db: AsyncIOMotorDatabase,
    domain: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> List[dict]:
    query = {}
    if domain:
        query["domain"] = domain
    if priority:
        query["priority"] = priority
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    cursor = db[COLLECTION].find(query).sort("created_at", -1)
    tickets = []
    async for doc in cursor:
        tickets.append(ticket_from_doc(doc))
    return tickets


async def get_ticket_by_id(db: AsyncIOMotorDatabase, ticket_id: int) -> dict:
    doc = await db[COLLECTION].find_one({"id": ticket_id})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Ticket #{ticket_id} not found")
    return ticket_from_doc(doc)


async def update_ticket(
    db: AsyncIOMotorDatabase, ticket_id: int, data: TicketUpdate
) -> dict:
    await get_ticket_by_id(db, ticket_id)
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No update fields provided")
    updates["updated_at"] = datetime.now(timezone.utc)
    await db[COLLECTION].update_one({"id": ticket_id}, {"$set": updates})
    updated = await db[COLLECTION].find_one({"id": ticket_id})
    return ticket_from_doc(updated)


async def delete_ticket(db: AsyncIOMotorDatabase, ticket_id: int) -> dict:
    await get_ticket_by_id(db, ticket_id)
    await db[COLLECTION].delete_one({"id": ticket_id})
    return {"success": True, "message": f"Ticket #{ticket_id} deleted successfully"}


async def get_summary(db: AsyncIOMotorDatabase) -> dict:
    total = await db[COLLECTION].count_documents({})

    per_domain = {}
    for d in DOMAINS:
        per_domain[d] = await db[COLLECTION].count_documents({"domain": d})

    per_status = {}
    for s in STATUSES:
        per_status[s] = await db[COLLECTION].count_documents({"status": s})

    per_priority = {}
    for p in PRIORITIES:
        per_priority[p] = await db[COLLECTION].count_documents({"priority": p})

    high_priority_count = await db[COLLECTION].count_documents(
        {"priority": {"$in": ["High", "Critical"]}}
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

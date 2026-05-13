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
    pipeline = [
        {
            "$facet": {
                "total": [{"$count": "count"}],
                "domains": [{"$group": {"_id": "$domain", "count": {"$sum": 1}}}],
                "statuses": [{"$group": {"_id": "$status", "count": {"$sum": 1}}}],
                "priorities": [{"$group": {"_id": "$priority", "count": {"$sum": 1}}}],
                "high_priority": [
                    {"$match": {"priority": {"$in": ["High", "Critical"]}}},
                    {"$count": "count"},
                ],
            }
        }
    ]

    results = await db[COLLECTION].aggregate(pipeline).to_list(length=1)
    data = results[0] if results else {}

    # Format into the schema expected by frontend
    per_domain = {d: 0 for d in DOMAINS}
    for item in data.get("domains", []):
        if item["_id"] in per_domain:
            per_domain[item["_id"]] = item["count"]

    per_status = {s: 0 for s in STATUSES}
    for item in data.get("statuses", []):
        if item["_id"] in per_status:
            per_status[item["_id"]] = item["count"]

    per_priority = {p: 0 for p in PRIORITIES}
    for item in data.get("priorities", []):
        if item["_id"] in per_priority:
            per_priority[item["_id"]] = item["count"]

    total = data["total"][0]["count"] if data.get("total") else 0
    high_priority = data["high_priority"][0]["count"] if data.get("high_priority") else 0

    return {
        "total_tickets": total,
        "tickets_per_domain": per_domain,
        "tickets_per_status": per_status,
        "tickets_per_priority": per_priority,
        "high_priority_count": high_priority,
        "open_count": per_status.get("Open", 0),
        "closed_count": per_status.get("Closed", 0),
        "in_progress_count": per_status.get("In Progress", 0),
    }

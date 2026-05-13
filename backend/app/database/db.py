import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ticketflow")

client: AsyncIOMotorClient = None
database = None


async def connect_db():
    global client, database
    client = AsyncIOMotorClient(MONGODB_URL)
    database = client[DB_NAME]
    print(f"[DB] Connected to MongoDB: {DB_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("[DB] MongoDB connection closed")


def get_database():
    return database

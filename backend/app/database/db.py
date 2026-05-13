import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ticketflow")

# Fix Render's postgres:// prefix issue (not needed for Mongo but safe)
if MONGODB_URL.startswith("mongo+srv"):
    MONGODB_URL = "mongodb" + MONGODB_URL[5:]

client: AsyncIOMotorClient = None
database = None


async def connect_db():
    global client, database
    try:
        print(f"[DB] Connecting to MongoDB... DB: {DB_NAME}")
        client = AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=20000,
            maxPoolSize=10,
            minPoolSize=1,
            retryWrites=True,
            retryReads=True,
            tls=True,
            tlsAllowInvalidCertificates=False,
        )
        # Verify connection works
        await client.admin.command("ping")
        database = client[DB_NAME]
        print(f"[DB] ✅ Connected to MongoDB Atlas — database: {DB_NAME}")
    except Exception as e:
        print(f"[DB] ❌ MongoDB connection failed: {e}")
        raise e


async def close_db():
    global client
    if client:
        client.close()
        print("[DB] MongoDB connection closed")


def get_database():
    global database
    if database is None:
        raise Exception("Database not initialized")
    return database


async def check_db_health() -> bool:
    global client
    try:
        if client is None:
            return False
        await client.admin.command("ping")
        return True
    except Exception as e:
        print(f"[DB] Health check failed: {e}")
        return False

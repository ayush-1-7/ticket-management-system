import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ticketflow")

# Remove the buggy prefix check that was corrupting the URL
# (It was turning mongodb+srv into mongodbdb+srv)

client: AsyncIOMotorClient = None
database = None


async def connect_db():
    global client, database
    try:
        print(f"[DB] Connecting to MongoDB... DB: {DB_NAME}")
        # Clean the URL just in case of whitespace
        url = MONGODB_URL.strip()
        
        client = AsyncIOMotorClient(
            url,
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
        # We don't raise here to allow the server to start (lifespan handles it)
        database = None


async def close_db():
    global client
    if client:
        client.close()
        print("[DB] MongoDB connection closed")


def get_database():
    global database
    if database is None:
        raise Exception("Database not initialized. Check your MONGODB_URL environment variable.")
    return database


async def check_db_health() -> bool:
    global client, database
    try:
        if client is None or database is None:
            return False
        await client.admin.command("ping")
        return True
    except Exception as e:
        print(f"[DB] Health check failed: {e}")
        return False

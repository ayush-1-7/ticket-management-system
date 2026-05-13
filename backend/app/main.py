from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
from app.database.db import connect_db, close_db, check_db_health
from app.routes import tickets
import time


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_db()
    except Exception as e:
        print(f"Failed to connect to database on startup: {e}")
    yield
    await close_db()


app = FastAPI(
    title="TicketFlow API",
    description="Multi-Domain Ticket Management System — MongoDB Edition",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(round(time.time() - start, 4))
    return response


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " → ".join(str(loc) for loc in error["loc"] if loc != "body")
        errors.append({"field": field, "message": error["msg"]})
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation failed", "errors": errors},
    )


@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)},
    )


app.include_router(tickets.router)


@app.api_route("/", methods=["GET", "HEAD"], tags=["Health"])
async def root():
    db_status = "connected" if await check_db_health() else "disconnected"
    return {
        "service": "TicketFlow API",
        "version": "3.0.0",
        "database": f"MongoDB Atlas ({db_status})",
        "status": "operational",
    }


@app.get("/health", tags=["Health"])
async def health():
    is_connected = await check_db_health()
    return {
        "status": "healthy" if is_connected else "degraded",
        "database": "connected" if is_connected else "disconnected"
    }

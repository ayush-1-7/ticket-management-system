from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.database.db import engine, Base
from app.routes import tickets
import time

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-Domain Ticket Management System",
    description="A production-ready internal ticketing tool for managing issues across organizational domains.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(round(time.time() - start, 4))
    return response

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " → ".join(str(loc) for loc in error["loc"] if loc != "body")
        errors.append({"field": field, "message": error["msg"]})
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation failed", "errors": errors},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)},
    )

app.include_router(tickets.router)

@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Ticket Management API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}

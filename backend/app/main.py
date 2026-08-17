import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.logging_config import setup_logging

from handlers.board import router as board_router
from handlers.column import router as column_router
from handlers.task import router as task_router
from fastapi.middleware.cors import CORSMiddleware

setup_logging()

logger = logging.getLogger(__name__)


app = FastAPI(
    title="TaskFlow API",
    description="Kanban task management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://task-flow-rho-virid.vercel.app",
        "https://localhost",    
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(board_router)
app.include_router(column_router)
app.include_router(task_router)


@app.get("/")
def root():
    return {
        "message": "TaskFlow API is running"
    }


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):
    logger.exception(
        "Unhandled exception | method=%s | path=%s",
        request.method,
        request.url.path
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        }
    )

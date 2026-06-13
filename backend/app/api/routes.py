from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name, "environment": settings.app_env}


@router.get("/db/health", tags=["system"])
def database_health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "reachable"}

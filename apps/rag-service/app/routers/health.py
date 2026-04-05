"""
RAG Service - Health Router
"""

from fastapi import APIRouter
from app.config import get_settings
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    settings = get_settings()
    # Import here to avoid circular import
    from app.routers.generate import rag
    return HealthResponse(
        ollama_url=settings.ollama_base_url,
        model=settings.ollama_model,
        active_documents=len(rag._store),
    )

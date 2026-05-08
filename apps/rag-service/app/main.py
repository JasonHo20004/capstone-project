"""
RAG Service - FastAPI Application Entry Point
Auto-generates Flashcards from uploaded documents using LLM (Ollama).
"""

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routers import health, generate, explain, reading_gen, livestream
from app.routers.livestream import AUDIO_DIR, cleanup_audio_loop
from app.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="SkillBoost RAG Service",
        description="Auto-generate Flashcards from PDF/TXT documents using Ollama LLM",
        version="1.0.0",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:8080",
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(health.router)
    app.include_router(generate.router)
    app.include_router(explain.router)
    app.include_router(reading_gen.router)
    app.include_router(livestream.router)

    @app.on_event("startup")
    async def startup():
        AUDIO_DIR.mkdir(parents=True, exist_ok=True)
        asyncio.create_task(cleanup_audio_loop())
        print(f"🚀 RAG Service started on port {settings.rag_service_port}")
        print(f"🦙 Ollama: {settings.ollama_base_url} (model: {settings.ollama_model})")

    return app


app = create_app()

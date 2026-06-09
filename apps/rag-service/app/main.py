"""
RAG Service - FastAPI Application Entry Point
Auto-generates Flashcards from uploaded documents using LLM (Ollama).
"""

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routers import health, generate, explain, reading_gen, listening_gen, livestream, find_justification, transcribe
from app.routers.livestream import AUDIO_DIR, cleanup_audio_loop, start_pubsub_listener
from app.config import get_settings
from app.services.tts_service import is_gcloud_configured


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Alicia RAG Service",
        description="Auto-generate Flashcards from PDF/TXT documents using Ollama LLM",
        version="1.0.0",
    )

    # CORS — origins are environment-driven via settings.cors_origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(health.router)
    app.include_router(generate.router)
    app.include_router(explain.router)
    app.include_router(reading_gen.router)
    app.include_router(listening_gen.router)
    app.include_router(livestream.router)
    app.include_router(find_justification.router)
    app.include_router(transcribe.router)

    @app.on_event("startup")
    async def startup():
        AUDIO_DIR.mkdir(parents=True, exist_ok=True)
        # Keep a strong reference — asyncio only weakly references tasks, so a
        # bare create_task whose return is discarded can be GC'd before it runs.
        app.state.cleanup_task = asyncio.create_task(cleanup_audio_loop())
        # Per-process Redis Pub/Sub listener — delivers broadcast messages to the
        # sockets connected to THIS worker (required for multi-worker correctness).
        start_pubsub_listener()
        print(f"RAG Service started on port {settings.rag_service_port}")
        print(f"Ollama: {settings.ollama_base_url} (model: {settings.ollama_model})")
        gcloud_ok = is_gcloud_configured(settings.google_application_credentials)
        if gcloud_ok:
            print(f"[TTS] Google Cloud Neural2 ACTIVE — credentials: {settings.google_application_credentials}")
        else:
            print("[TTS] edge-tts ACTIVE — gcloud not configured (no credentials or package missing)")

    return app


app = create_app()

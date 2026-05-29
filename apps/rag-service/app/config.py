"""
RAG Service - Application Settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    rag_service_port: int = 8000

    # LLM provider — "gemini" (Gemini Flash, recommended) or "ollama" (local fallback)
    llm_provider: str = "gemini"

    # Gemini (Google AI Studio)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    # Ollama (via bore tunnel from Colab) — fallback when Gemini key empty/error
    ollama_base_url: str = "http://bore.pub:11434"
    ollama_model: str = "llama3.1"

    # Internal services
    flashcard_service_url: str = "http://localhost:3004"

    # Chunking
    chunk_size: int = 1000
    chunk_overlap: int = 200

    # Redis
    redis_url: str = "redis://localhost:6379"

    # JWT (same secret as identity-service ACCESS_TOKEN_SECRET)
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"

    # CORS — comma-separated allowed origins (per environment). In production most
    # browser traffic goes through the api-gateway, but this still applies to any
    # direct/WS access. Set to the gateway + frontend origins for your env.
    cors_origins: str = "http://localhost:8080,http://localhost:5173,http://localhost:3000"

    # Livestream
    audio_base_url: str = "http://localhost:8000"
    max_room_participants: int = 30
    questions_per_minute: int = 6
    # Comma-separated roles allowed to create/host a live room (e.g. "ADMIN,TEACHER").
    # Empty = any authenticated user may host. Requires jwt_secret to be set.
    livestream_host_roles: str = ""

    # TTS — "gcloud" (Google Cloud Neural2, premium) or "edge" (free fallback)
    tts_provider: str = "gcloud"
    # Path to GCP service-account JSON. If empty/missing, auto-falls back to edge-tts.
    google_application_credentials: str = ""

    # Pexels image search — free 200 req/hour for slide visuals
    # Get a free key at https://www.pexels.com/api/
    pexels_api_key: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

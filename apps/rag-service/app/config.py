"""
RAG Service - Application Settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    rag_service_port: int = 8000

    # Ollama (via bore tunnel from Colab)
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

    # Livestream
    audio_base_url: str = "http://localhost:8000"
    max_room_participants: int = 30
    questions_per_minute: int = 3

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

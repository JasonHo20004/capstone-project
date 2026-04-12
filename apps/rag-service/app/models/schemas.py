"""
RAG Service - Pydantic Models
"""

from pydantic import BaseModel, Field
from typing import Optional


class FlashcardItem(BaseModel):
    front_content: str = Field(..., description="Từ vựng / thuật ngữ")
    back_content: str = Field(..., description="Nghĩa / định nghĩa")
    example_sentence: Optional[str] = Field(None, description="Câu ví dụ")


class GenerateFlashcardsResponse(BaseModel):
    success: bool = True
    doc_id: str = Field("", description="Document ID for follow-up Q&A")
    deck_id: Optional[str] = None
    title: str
    flashcards: list[FlashcardItem]
    source_pages: int = 0
    chunks_used: int = 0


class GenerateFromTextRequest(BaseModel):
    text: str = Field(..., min_length=50, description="Nội dung văn bản để tạo flashcard")
    title: str = Field("AI Generated Deck", description="Tên bộ flashcard")
    user_id: str = Field(..., description="User ID")
    save_to_service: bool = Field(True, description="Lưu vào flashcard-service")


class AskQuestionRequest(BaseModel):
    doc_id: str = Field(..., description="Document ID từ kết quả generate")
    question: str = Field(..., min_length=3, description="Câu hỏi về tài liệu")


class AskQuestionResponse(BaseModel):
    success: bool = True
    answer: str
    relevant_chunks: list[str] = Field(default_factory=list, description="Các đoạn tài liệu liên quan")


class HealthResponse(BaseModel):
    service: str = "rag-service"
    status: str = "healthy"
    ollama_url: str
    model: str
    active_documents: int = 0

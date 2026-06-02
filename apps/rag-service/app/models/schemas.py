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


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ExplainRequest(BaseModel):
    passage: str = Field(..., min_length=1, description="Passage / transcript / '[LISTENING]' sentinel")
    question_text: str = Field(..., description="Nội dung câu hỏi")
    question_type: str = Field("MULTIPLE_CHOICE", description="Loại câu hỏi")
    options: list[str] = Field(default_factory=list, description="Các đáp án")
    correct_answer: str = Field(..., description="Đáp án đúng")
    user_answer: str = Field(..., description="Đáp án user đã chọn")
    test_skill: str = Field("READING", description="'READING' or 'LISTENING'")
    conversation_history: list[ChatMessage] = Field(default_factory=list, description="Lịch sử hội thoại cho follow-up")
    language: str = Field("vi", description="UI language code (i18n), e.g. 'vi' | 'en' — tutor replies in this language")


class ExplainResponse(BaseModel):
    success: bool = True
    explanation: str = Field(..., description="Giải thích chi tiết")
    passage_reference: str = Field("", description="Trích dẫn passage liên quan")
    tips: str = Field("", description="Mẹo cho dạng câu hỏi này")


class FindJustificationRequest(BaseModel):
    passage: str = Field(..., min_length=1, description="Reading passage hoặc listening transcript")
    question_text: str = Field("", description="Nội dung câu hỏi")
    question_type: str = Field("MULTIPLE_CHOICE", description="Loại câu hỏi")
    correct_answer: str = Field("", description="Đáp án đúng (dạng văn bản)")
    skill: str = Field("READING", description="'READING' or 'LISTENING'")


class FindJustificationResponse(BaseModel):
    success: bool = True
    snippet: str = Field("", description="Đoạn trích nguyên văn chứa đáp án, hoặc '' nếu không tìm thấy")
    start: Optional[int] = Field(None, description="Char offset bắt đầu trong passage")
    end: Optional[int] = Field(None, description="Char offset kết thúc trong passage")
    audio_start: Optional[float] = Field(None, description="Listening — giây (thường để client map từ Whisper segments)")
    audio_end: Optional[float] = Field(None, description="Listening — giây")
    confidence: Optional[float] = Field(None, description="Độ tin cậy 0.0-1.0")


class HealthResponse(BaseModel):
    service: str = "rag-service"
    status: str = "healthy"
    ollama_url: str
    model: str
    active_documents: int = 0

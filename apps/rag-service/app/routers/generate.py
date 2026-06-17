"""
RAG Service - Flashcard Generate Router
1. POST /api/rag/generate/flashcards       → Upload PDF/TXT → tạo Flashcard
2. POST /api/rag/generate/flashcards/text  → Nhập text trực tiếp → tạo Flashcard
"""

from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from app.services.pdf_extractor import extract_text_from_pdf, extract_text_from_txt
from app.services.rag_pipeline import RAGPipeline
from app.services.flashcard_generator import generate_flashcards
from app.clients.flashcard_client import save_flashcards_to_service
from app.models.schemas import (
    GenerateFlashcardsResponse,
    GenerateFromTextRequest,
)

router = APIRouter(tags=["RAG"])

rag = RAGPipeline()


# ── Endpoint 1: Generate Flashcards ──────────────────────────────────────────

@router.post("/api/rag/generate/flashcards", response_model=GenerateFlashcardsResponse)
async def generate_flashcards_endpoint(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form("AI Generated Deck"),
    user_id: str = Form(...),
    save_to_service: bool = Form(True),
    deck_id: Optional[str] = Form(None),
):
    """
    Upload PDF/TXT → extract text → chunk → LLM tạo flashcard.
    deck_id: nếu có → thêm card vào deck đó; None → tạo deck mới.
    """
    filename = file.filename or ""
    if not filename.lower().endswith((".pdf", ".txt")):
        raise HTTPException(400, "Only PDF and TXT files are supported.")

    content = await file.read()
    if filename.lower().endswith(".pdf"):
        text, page_count = extract_text_from_pdf(content)
    else:
        text, page_count = extract_text_from_txt(content)

    if not text or len(text) < 50:
        raise HTTPException(400, "Document has too little text to generate flashcards.")

    # Step 1: Chunk for flashcard generation (no embedding needed)
    chunks = rag.chunk_document(text)
    chunk_count = len(chunks)

    # Step 2: Generate flashcards via LLM
    flashcards = await generate_flashcards(chunks)
    if not flashcards:
        raise HTTPException(500, "LLM failed to generate flashcards. Try again.")

    # Step 3: Save to flashcard-service (optional)
    saved_deck_id = None
    if save_to_service:
        auth_token = request.headers.get("authorization", "").replace("Bearer ", "")
        try:
            saved_deck_id = await save_flashcards_to_service(
                user_id=user_id,
                title=title,
                flashcards=flashcards,
                auth_token=auth_token,
                deck_id=deck_id,
            )
        except Exception as e:
            print(f"[RAG] Warning: Could not save to flashcard-service: {e}")

    return GenerateFlashcardsResponse(
        title=title,
        flashcards=flashcards,
        doc_id="",
        deck_id=saved_deck_id,
        source_pages=page_count,
        chunks_used=chunk_count,
    )


# ── Endpoint 1b: Generate Flashcards from TEXT ───────────────────────────────

@router.post("/api/rag/generate/flashcards/text", response_model=GenerateFlashcardsResponse)
async def generate_flashcards_from_text_endpoint(
    request: Request,
    body: GenerateFromTextRequest,
):
    """
    Nhận văn bản trực tiếp (text) → chunk → LLM tạo flashcard.
    Giống ChatGPT — user paste/nhập nội dung, không cần upload file.
    """
    text = body.text.strip()
    if len(text) < 50:
        raise HTTPException(400, "Text quá ngắn. Cần ít nhất 50 ký tự để tạo flashcard.")

    # Step 1: Chunk
    chunks = rag.chunk_document(text)
    chunk_count = len(chunks)

    # Step 2: Generate flashcards via LLM
    flashcards = await generate_flashcards(chunks)
    if not flashcards:
        raise HTTPException(500, "LLM failed to generate flashcards. Try again.")

    # Step 3: Save to flashcard-service (optional)
    saved_deck_id = None
    if body.save_to_service:
        auth_token = request.headers.get("authorization", "").replace("Bearer ", "")
        try:
            saved_deck_id = await save_flashcards_to_service(
                user_id=body.user_id,
                title=body.title,
                flashcards=flashcards,
                auth_token=auth_token,
                deck_id=body.deck_id,
            )
        except Exception as e:
            print(f"[RAG] Warning: Could not save to flashcard-service: {e}")

    return GenerateFlashcardsResponse(
        title=body.title,
        flashcards=flashcards,
        doc_id="",
        deck_id=saved_deck_id,
        source_pages=0,
        chunks_used=chunk_count,
    )

"""
RAG Service - Dictation Transcription Router

POST /transcribe/dictation
  Accepts an uploaded audio file, runs Whisper locally on CPU (faster-whisper),
  splits + cleans the transcript via the dictation pipeline, and returns ready-
  to-import sentences:

    { success, sentences: [{index, text, startTime, endTime}], totalSentences, report }

This replaces the old Kaggle-notebook → JSON → manual-import workflow: the
assessment-service forwards the admin's audio upload here, gets clean sentences
back, and the admin only ever uploads an audio file.
"""

import asyncio
import os
import tempfile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.services import whisper_service
from app.services.dictation_pipeline import build_sentences

import logging

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/transcribe", tags=["Dictation Transcription"])

# Guard against runaway uploads — admin dictation clips are short (a few minutes).
MAX_AUDIO_BYTES = 100 * 1024 * 1024  # 100 MB


class DictationSentence(BaseModel):
    index: int
    text: str
    startTime: float
    endTime: float


class TranscribeResponse(BaseModel):
    success: bool = True
    sentences: list[DictationSentence] = []
    totalSentences: int = 0
    report: dict = {}


@router.post("/dictation", response_model=TranscribeResponse)
async def transcribe_dictation(
    audio: UploadFile = File(..., description="Audio file (mp3/wav/m4a/...)"),
    language: str = Form("en"),
    skip_before_seconds: float = Form(0),
    skip_first_n: int = Form(0),
):
    data = await audio.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty audio file")
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Audio file too large (max 100MB)")

    # Sanitize and whitelist file suffixes
    ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".flac"}
    suffix = os.path.splitext(audio.filename or "")[1].lower()
    if not suffix or suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    # faster-whisper reads from a file path, so persist the upload to a temp file.
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(data)
            tmp_path = tmp.name

        # CPU transcription is blocking — run it off the event loop.
        segments = await asyncio.to_thread(whisper_service.transcribe, tmp_path, language)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Transcription failed: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Transcription failed. Please try again.") from exc
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass

    sentences, report = build_sentences(
        segments,
        skip_before_seconds=skip_before_seconds,
        skip_first_n=skip_first_n,
    )

    return TranscribeResponse(
        success=True,
        sentences=sentences,
        totalSentences=len(sentences),
        report=report,
    )

"""
RAG Service - AI Listening Test Generator
POST /api/rag/listening/generate
  → Synthesize listening audio from a script (TTS) AND generate IELTS-style
    questions from that script. Returns { audio_url, transcript, questions }.

Reuses the same question-format spec as the reading generator (the spoken script
plays the role of the "passage"), and the existing TTS + storage services that
power the live classroom, so listening audio is durable (uploaded to S3 when
configured) exactly like lesson narration.
"""

import json
import re
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings
from app.services.tts_service import AUDIO_DIR, synthesize_to_file
from app.services.storage import store_audio_and_url
from app.services.llm_service import generate_text
from app.routers.reading_gen import READING_GEN_PROMPT, GeneratedQuestion

router = APIRouter(tags=["Listening Generator"])


# ── Request / Response ────────────────────────────────────────────────────────

class ListeningGenRequest(BaseModel):
    transcript: str = Field(..., min_length=30, description="Audio script to speak + build questions from")
    question_types: list[str] = Field(
        default=["MULTIPLE_CHOICE", "GAP_FILL", "SHORT_ANSWER", "MATCHING"],
        description="Question types to generate",
    )
    num_questions: int = Field(default=10, ge=1, le=40)
    difficulty: str = Field(default="intermediate", description="easy / intermediate / hard")
    language: str = Field(default="en", description="TTS language: 'en' | 'vi'")
    level: str = Field(default="intermediate", description="Voice level: beginner / intermediate / advanced")


class ListeningGenResponse(BaseModel):
    success: bool = True
    audio_url: str = ""
    transcript: str = ""
    questions: list[GeneratedQuestion] = []
    summary: str = ""


# ── TTS helpers ────────────────────────────────────────────────────────────────

def _split_for_tts(text: str, max_len: int = 3500) -> list[str]:
    """Split a long script into chunks at sentence boundaries.

    Google Cloud TTS caps a single request at ~5000 bytes, so a full listening
    script must be synthesized in pieces and stitched together.
    """
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks: list[str] = []
    cur = ""
    for s in sentences:
        if cur and len(cur) + len(s) + 1 > max_len:
            chunks.append(cur)
            cur = s
        else:
            cur = f"{cur} {s}".strip() if cur else s
    if cur:
        chunks.append(cur)
    return chunks or [text[:max_len]]


async def _synthesize_script(text: str, level: str, language: str, settings) -> str:
    """Synthesize the (possibly long) script to one MP3 and return its served URL."""
    chunks = _split_for_tts(text, 3500)
    parts = []
    for chunk in chunks:
        try:
            fn = await synthesize_to_file(
                chunk, level, language,
                provider=settings.tts_provider,
                credentials_path=settings.google_application_credentials,
            )
            if fn:
                parts.append(AUDIO_DIR / fn)
        except Exception as e:
            print(f"[Listening Gen] TTS chunk failed: {e}")

    if not parts:
        return ""
    if len(parts) == 1:
        return await store_audio_and_url(parts[0], parts[0].name, settings.audio_base_url)

    # Concatenate the per-chunk MP3s into a single file (byte-append plays back
    # sequentially in browsers), then serve/upload that.
    final_name = f"listening_{uuid.uuid4().hex}.mp3"
    final_path = AUDIO_DIR / final_name
    with open(final_path, "wb") as out:
        for p in parts:
            try:
                out.write(p.read_bytes())
            except Exception:
                pass
    # Tidy up the intermediate chunk files (best-effort).
    for p in parts:
        try:
            p.unlink(missing_ok=True)
        except Exception:
            pass
    return await store_audio_and_url(final_path, final_name, settings.audio_base_url)


# ── Question helpers ────────────────────────────────────────────────────────────

def _parse_questions(raw: str) -> list[GeneratedQuestion]:
    json_str = raw
    if "```json" in json_str:
        json_str = json_str.split("```json")[1].split("```")[0].strip()
    elif "```" in json_str:
        json_str = json_str.split("```")[1].split("```")[0].strip()

    start = json_str.find("[")
    end = json_str.rfind("]")
    if start != -1 and end != -1:
        json_str = json_str[start:end + 1]

    questions_raw = json.loads(json_str)
    if not isinstance(questions_raw, list):
        raise ValueError("AI did not return a question array")

    valid_types = {
        "MULTIPLE_CHOICE", "TRUE_FALSE_NOT_GIVEN", "YES_NO_NOT_GIVEN",
        "GAP_FILL", "MATCHING", "SHORT_ANSWER", "MULTIPLE_CHOICE_MULTI_ANSWER",
    }
    out: list[GeneratedQuestion] = []
    for i, q in enumerate(questions_raw):
        if not isinstance(q, dict):
            continue
        qt = q.get("questionType", "MULTIPLE_CHOICE")
        if qt not in valid_types:
            qt = "MULTIPLE_CHOICE"
        out.append(GeneratedQuestion(
            questionText=q.get("questionText", f"Question {i + 1}"),
            questionType=qt,
            options=q.get("options", []),
            content=q.get("content", {}),
            answer=q.get("answer", {}),
            explanation=q.get("explanation", ""),
            questionOrder=i + 1,
        ))
    return out


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/api/rag/listening/generate", response_model=ListeningGenResponse)
async def generate_listening(body: ListeningGenRequest):
    """Generate a listening test (audio + questions) from a script."""
    settings = get_settings()
    transcript = body.transcript.strip()
    lang = body.language if body.language in ("en", "vi") else "en"

    # 1) Synthesize the audio (independent of question generation — if TTS fails
    #    the teacher still gets questions and can attach audio manually).
    audio_url = ""
    try:
        audio_url = await _synthesize_script(transcript[:8000], body.level, lang, settings)
    except Exception as e:
        print(f"[Listening Gen] TTS failed: {e}")

    # 2) Generate questions from the script (same format as the reading generator).
    types_list = ", ".join(body.question_types)
    prompt = READING_GEN_PROMPT.format(
        passage=transcript[:6000],
        num_questions=body.num_questions,
        question_types_list=types_list,
        difficulty=body.difficulty,
    )
    questions: list[GeneratedQuestion] = []
    try:
        raw = await generate_text(
            prompt, settings,
            temperature=0.4, max_tokens=8192, timeout=300,
        )
        questions = _parse_questions(raw)
    except json.JSONDecodeError as e:
        print(f"[Listening Gen] JSON parse error: {e}")
    except Exception as e:
        print(f"[Listening Gen] Question generation failed: {e}")

    if not audio_url and not questions:
        raise HTTPException(502, "Could not generate listening audio or questions. Please try again.")

    return ListeningGenResponse(
        success=True,
        audio_url=audio_url,
        transcript=transcript,
        questions=questions,
        summary=f"Generated {len(questions)} listening questions ({types_list})"
                + ("" if audio_url else " — audio synthesis unavailable, attach audio manually."),
    )

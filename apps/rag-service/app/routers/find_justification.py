"""
RAG Service - Answer Reference / Justification Router
POST /api/rag/find-justification

Given a reading passage (or listening transcript), a question, and its correct
answer, locate the exact sentence that justifies the answer — the Study4-style
"answer location". Returns the verbatim snippet plus char offsets into the
supplied passage so the editor/review UI can highlight the precise span.

Audio timestamps for listening are resolved on the client from Whisper segments
(this service only sees the transcript text), so audio_start/audio_end stay null.
"""

import re

from fastapi import APIRouter

from app.models.schemas import FindJustificationRequest, FindJustificationResponse
from app.config import get_settings
from app.services.llm_service import generate_text, extract_json_object

router = APIRouter(tags=["Answer Reference"])


FIND_JUSTIFICATION_PROMPT = """Bạn là chuyên gia ra đề IELTS {skill_label}. Cho một đoạn {source_label} và một câu hỏi kèm đáp án đúng. Nhiệm vụ: tìm CHÍNH XÁC câu (hoặc cụm câu liền nhau, càng ngắn càng tốt) trong đoạn {source_label} chứng minh cho đáp án đúng.

**ĐOẠN {source_upper}:**
\"\"\"
{passage}
\"\"\"

**CÂU HỎI (dạng {question_type}):** {question_text}
**ĐÁP ÁN ĐÚNG:** {correct_answer}

YÊU CẦU:
- Trích NGUYÊN VĂN (copy y hệt, giữ nguyên chữ hoa/thường và dấu câu) đoạn ngắn nhất trong {source_label} chứa bằng chứng cho đáp án.
- KHÔNG diễn giải, KHÔNG dịch, KHÔNG thêm bất kỳ chữ nào ngoài đoạn trích.
- Với True/False/Not Given hoặc Yes/No/Not Given: nếu là NOT GIVEN (không có thông tin), trả "snippet" = "".
- Nếu không tìm thấy bằng chứng rõ ràng, trả "snippet" = "".

Chỉ trả về JSON đúng định dạng sau, không thêm gì khác:
{{"snippet": "<đoạn trích nguyên văn>", "confidence": <số thực 0.0-1.0>}}"""


def _locate(passage: str, snippet: str):
    """Find (start, end) char offsets of snippet in passage, tolerant of whitespace.

    Returns (None, None) if the snippet can't be anchored to the source text.
    """
    if not snippet:
        return None, None
    # 1) Exact substring.
    idx = passage.find(snippet)
    if idx >= 0:
        return idx, idx + len(snippet)
    # 2) Whitespace/case-flexible match. re.escape() escapes spaces on Python
    # 3.7+, so escape each non-space token and rejoin with \s+ (running re.sub
    # over the escaped string would corrupt the pattern and never match).
    tokens = snippet.split()
    if not tokens:
        return None, None
    pattern = r"\s+".join(re.escape(tok) for tok in tokens)
    m = re.search(pattern, passage, re.IGNORECASE)
    if m:
        return m.start(), m.end()
    return None, None


@router.post("/api/rag/find-justification", response_model=FindJustificationResponse)
async def find_justification(body: FindJustificationRequest):
    """Locate the sentence in the passage/transcript that justifies the answer."""
    settings = get_settings()
    is_listening = (body.skill or "").upper() == "LISTENING"

    prompt = FIND_JUSTIFICATION_PROMPT.format(
        skill_label="Listening" if is_listening else "Reading",
        source_label="transcript" if is_listening else "bài đọc",
        source_upper="TRANSCRIPT" if is_listening else "BÀI ĐỌC",
        passage=body.passage[:6000],
        question_type=body.question_type,
        question_text=body.question_text or "(không có nội dung — dựa vào đáp án đúng)",
        correct_answer=body.correct_answer or "(không rõ)",
    )

    raw = await generate_text(
        prompt,
        settings,
        temperature=0.1,
        max_tokens=400,
        timeout=60.0,
        json_mode=True,
    )
    data = extract_json_object(raw) or {}
    snippet = str(data.get("snippet") or "").strip()
    confidence = data.get("confidence")
    if not isinstance(confidence, (int, float)):
        confidence = None

    if not snippet:
        return FindJustificationResponse(success=True, snippet="", confidence=confidence)

    # Only trust offsets we can anchor verbatim in the source. When the model
    # paraphrases slightly we still return the snippet text (the client can
    # fuzzy-highlight) but without offsets.
    start, end = _locate(body.passage, snippet)
    if start is None:
        return FindJustificationResponse(success=True, snippet=snippet, confidence=confidence)

    return FindJustificationResponse(
        success=True,
        snippet=body.passage[start:end],  # exact source substring → clean highlight
        start=start,
        end=end,
        confidence=confidence,
    )

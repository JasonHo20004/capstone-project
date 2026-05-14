"""
RAG Service - AI Livestream Classroom Router (production-hardened + replay)

Features:
  - Room state persisted in Redis (survives restarts)
  - JWT auth via ?token= query param on WebSocket
  - Audio saved to disk, served via URL (not base64)
  - Rate limiting per user (Redis counter)
  - Max participant cap per room
  - Recording saved on lesson complete (7-day retention)
  - Replay endpoint: GET /recordings + GET /recordings/{id}
  - Cleanup skips audio files referenced by active recordings
"""

import asyncio
import json
import re
import time
import uuid
from datetime import datetime
from pathlib import Path

import jwt as pyjwt
from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from pydantic import BaseModel
import redis.asyncio as aioredis

from app.services.tts_service import AUDIO_DIR, synthesize_to_file
from app.services.llm_service import generate_text, extract_json_object
from app.services.image_service import fetch_images_for_queries

router = APIRouter(prefix="/api/livestream", tags=["Livestream"])

# ── In-process WebSocket registry ─────────────────────────────────────────────
_connections: dict[str, dict[str, WebSocket]] = {}
_user_names: dict[str, dict[str, str]] = {}
_raised_hands: dict[str, list[str]] = {}  # room_id → ordered queue of user_ids

# Reactions allowlist — only these emojis can be broadcast
ALLOWED_REACTIONS = {"👍", "❤️", "👏", "🎉", "🤔", "😮", "🔥", "😂"}


def _participants_payload(room_id: str, host_id: str) -> list[dict]:
    """Build participant list snapshot for a room."""
    names = _user_names.get(room_id, {})
    raised = _raised_hands.get(room_id, [])
    return [
        {
            "user_id": uid,
            "user_name": names.get(uid, "Student"),
            "is_host": uid == host_id,
            "hand_raised": uid in raised,
            "hand_position": (raised.index(uid) + 1) if uid in raised else 0,
        }
        for uid in _connections.get(room_id, {})
    ]


async def _broadcast_participants(room_id: str, host_id: str):
    await _broadcast(room_id, {
        "type": "participant_list",
        "participants": _participants_payload(room_id, host_id),
    })

# ── Acronym normaliser for TTS ─────────────────────────────────────────────────
# All-caps tokens get read letter-by-letter by neural TTS — map to phonetic form.
_PHONETIC: dict[str, str] = {
    "IELTS": "eye-elts",
    "TOEFL": "toe-full",
    "TOEIC": "toe-ick",
    "GMAT":  "gee-mat",
    "CEFR":  "seffer",
    "FCE":   "F C E",
    "CAE":   "C A E",
    "GRE":   "G R E",
    "SAT":   "S A T",
    "ESL":   "E S L",
    "EFL":   "E F L",
}
_ACRONYM_RE = re.compile(r"\b(" + "|".join(re.escape(k) for k in _PHONETIC) + r")\b")

def _normalize_tts(text: str) -> str:
    """Replace known acronyms with TTS-friendly phonetic spellings."""
    return _ACRONYM_RE.sub(lambda m: _PHONETIC[m.group(0)], text)

# ── Constants ──────────────────────────────────────────────────────────────────
LEVEL_LABELS = {
    "beginner":     "Beginner (A1–A2)",
    "intermediate": "Intermediate (B1–B2)",
    "advanced":     "Advanced (C1–C2)",
}
ROOM_TTL = 86400
RECORDING_TTL = 7 * 86400


# ── Pydantic models ────────────────────────────────────────────────────────────

class CreateRoomRequest(BaseModel):
    topic: str          # display title shown on room cards
    lesson_prompt: str = ""  # AI generation directive (empty → use topic)
    level: str = "intermediate"
    language: str = "en"  # "en" | "vi"
    host_id: str
    host_name: str


class TranslateRequest(BaseModel):
    word: str           # token to translate (max 80 chars)
    target: str = "vi"  # target language


# ── Redis helpers ──────────────────────────────────────────────────────────────

async def _get_redis(settings) -> aioredis.Redis:
    return aioredis.from_url(settings.redis_url, decode_responses=True)


async def _load_room(r: aioredis.Redis, room_id: str) -> dict | None:
    raw = await r.get(f"livestream:room:{room_id}")
    return json.loads(raw) if raw else None


async def _save_room(r: aioredis.Redis, room: dict):
    await r.set(f"livestream:room:{room['id']}", json.dumps(room), ex=ROOM_TTL)


async def _list_rooms(r: aioredis.Redis) -> list[dict]:
    keys = await r.keys("livestream:room:*")
    if not keys:
        return []
    values = await r.mget(*keys)
    return [json.loads(v) for v in values if v and json.loads(v)["status"] != "ended"]


async def _load_recording(r: aioredis.Redis, room_id: str) -> dict | None:
    raw = await r.get(f"livestream:recording:{room_id}")
    return json.loads(raw) if raw else None


async def _list_recordings(r: aioredis.Redis) -> list[dict]:
    keys = await r.keys("livestream:recording:*")
    if not keys:
        return []
    values = await r.mget(*keys)
    recs = [json.loads(v) for v in values if v]
    recs.sort(key=lambda x: x.get("completed_at", ""), reverse=True)
    return recs


async def _save_recording(r: aioredis.Redis, room: dict, sections: list[dict]):
    recording = {
        "room_id": room["id"],
        "topic": room["topic"],
        "level": room["level"],
        "level_label": LEVEL_LABELS.get(room["level"], room["level"]),
        "host_name": room["host_name"],
        "completed_at": datetime.utcnow().isoformat(),
        "sections": sections,
        "qa": room.get("qa", []),
    }
    await r.set(f"livestream:recording:{room['id']}", json.dumps(recording), ex=RECORDING_TTL)


def _protected_filenames(recording: dict) -> set[str]:
    """Collect all audio filenames referenced by a recording."""
    files: set[str] = set()
    for s in recording.get("sections", []):
        url = s.get("audio_url", "")
        if url:
            files.add(url.split("/")[-1])
    for qa in recording.get("qa", []):
        url = qa.get("audio_url", "")
        if url:
            files.add(url.split("/")[-1])
    return files


# ── JWT auth ───────────────────────────────────────────────────────────────────

def _verify_jwt(token: str, secret: str, algorithm: str) -> dict | None:
    if not token or not secret:
        return None
    try:
        return pyjwt.decode(token, secret, algorithms=[algorithm])
    except pyjwt.PyJWTError:
        return None


# ── Rate limiting ──────────────────────────────────────────────────────────────

async def _is_rate_limited(r: aioredis.Redis, user_id: str, limit: int) -> bool:
    key = f"livestream:rate:{user_id}:{int(time.time() / 60)}"
    count = await r.incr(key)
    if count == 1:
        await r.expire(key, 60)
    return count > limit


# ── Audio cleanup ──────────────────────────────────────────────────────────────

async def cleanup_audio_loop():
    """Hourly cleanup — skips files referenced by active recordings."""
    while True:
        await asyncio.sleep(3600)
        now = time.time()
        try:
            from app.config import get_settings
            settings = get_settings()
            r = await _get_redis(settings)
            try:
                protected: set[str] = set()
                for rec in await _list_recordings(r):
                    protected |= _protected_filenames(rec)
            finally:
                await r.aclose()

            for p in AUDIO_DIR.iterdir():
                if p.suffix == ".mp3" and p.name not in protected:
                    if (now - p.stat().st_mtime) > 7200:
                        p.unlink(missing_ok=True)
        except Exception as e:
            print(f"[Livestream] Cleanup error: {e}")


# ── Broadcast ──────────────────────────────────────────────────────────────────

async def _broadcast(room_id: str, message: dict):
    dead = []
    for uid, ws in list(_connections.get(room_id, {}).items()):
        try:
            await ws.send_json(message)
        except Exception:
            dead.append(uid)
    for uid in dead:
        _connections.get(room_id, {}).pop(uid, None)
        _user_names.get(room_id, {}).pop(uid, None)


# ── Lesson generation ──────────────────────────────────────────────────────────

_LESSON_PROMPT_EN = """You are a master English teacher delivering a live lesson. Your ONLY job is to answer the teaching directive below — do NOT teach the general topic of the lesson title.

═══ THE TEACHING DIRECTIVE (this is what you MUST answer) ═══
{lesson_focus}
═══════════════════════════════════════════════════════════════

LESSON LABEL (display only — DO NOT teach general background of this): "{topic}"
AUDIENCE: {level} English learners.

🚫 ABSOLUTE RULE: every section must directly serve the DIRECTIVE above. The label is just a display string for the slide header. If your sentence sounds like a generic intro to the lesson label (e.g. "IELTS is an important exam…"), DELETE IT and replace with content that directly advances the directive.

═══ ADAPTIVE STRUCTURE — choose the 5-section decomposition that BEST fits the directive ═══

First, identify what TYPE of question the directive is:
- TIMELINE / ROADMAP question (e.g. "how to go from 0 to 6.0 in 12 months", "plan for 3 months") → 5 sections = sequential phases of the timeline. Each section is a concrete phase with weeks/months, what to focus on, what milestones.
- TECHNIQUE / HOW-TO question (e.g. "how to develop ideas in Speaking Part 2") → 5 sections = problem framing → technique 1 → technique 2 → worked example → mistakes & action plan.
- COMPARISON / OPTIONS question (e.g. "PTE vs IELTS, which fits me?") → 5 sections = criterion-by-criterion comparison + recommendation.
- TROUBLESHOOTING question (e.g. "why is my Writing stuck at 5.5?") → 5 sections = diagnosis → top 3 root causes → fix for each → 7-day rescue plan.
- CONCEPT / EXPLAINER question (e.g. "what is IELTS band descriptor?") → 5 sections = core idea → mechanics → why it matters → real example → how it changes student's daily practice.

DEFAULT if unsure: TECHNIQUE.

For the chosen structure, design 5 sections where EACH section advances the directive by a specific, concrete step. Section titles MUST reflect the directive — not the lesson label. Example: directive "12-month roadmap from 0 to 6.0" → titles like "Months 1-2: Survive English first", "Months 3-5: Build foundation grammar + 800 core words", NOT "Welcome to IELTS Foundation".

═══ HARD QUALITY RULES ═══
1. EVERY section must concretely advance the directive. Background filler about the lesson label is FORBIDDEN.
2. "title" 5-12 words, MUST reference the specific phase/technique/option this section covers — not the lesson label generically.
3. "content" 80-130 words (5-7 sentences) — warm, conversational, information-dense. NO generic platitudes.
4. "key_points" EXACTLY 4 bullets, each 10-18 words, CONCRETE actionable items (e.g. "Drill 20 minutes of Cambridge listening test 1 daily", NOT "practice listening regularly").
5. "keywords" EXACTLY 3 English terms relevant to this section's specific content.
6. "example" a natural English sentence (12-20 words) demonstrating the section's idea in real use.
7. "practice_phrase" empty string "" for 3 sections; for 2 sections, a 6-12 word natural English phrase to read aloud.
8. "image_query" 2-4 concrete English visual keywords matching this section.
9. FORBIDDEN openings for "content": "Welcome", "Today's lesson", "In this section", "Let's explore", "{topic} is important", "Many students…". Start each section with a concrete statement or scenario tied to the directive.

═══ OUTPUT ═══
Respond ONLY with valid JSON, no extra text:
{{"sections": [{{"title": "string", "content": "string (80-130 words)", "key_points": ["s","s","s","s"], "keywords": [{{"term":"s","meaning":"s"}},{{"term":"s","meaning":"s"}},{{"term":"s","meaning":"s"}}], "example": "string", "practice_phrase": "string", "image_query": "string"}}, ...5 total sections...]}}

LANGUAGE: {level}-appropriate English. Every field in English."""

_LESSON_PROMPT_VI = """Bạn là giáo viên tiếng Anh giỏi đang dạy livestream. Nhiệm vụ DUY NHẤT là trả lời NỘI DUNG CẦN DẠY bên dưới — KHÔNG được dạy chung chung về tiêu đề bài.

═══ NỘI DUNG CẦN DẠY (đây là cái bạn PHẢI trả lời) ═══
{lesson_focus}
═══════════════════════════════════════════════════

NHÃN BÀI (chỉ để hiển thị — KHÔNG được lan man về nhãn này): "{topic}"
ĐỐI TƯỢNG: học viên trình độ {level}.

🚫 LUẬT TUYỆT ĐỐI: mỗi phần phải trực tiếp phục vụ NỘI DUNG CẦN DẠY ở trên. Nhãn bài chỉ là chuỗi hiển thị trên header slide. Nếu một câu nghe giống intro chung chung về nhãn bài (vd "IELTS là kỳ thi quốc tế quan trọng…"), XOÁ ĐI và thay bằng nội dung trực tiếp đẩy directive tiến lên.

═══ CẤU TRÚC THÍCH NGHI — chọn cách chia 5 phần PHÙ HỢP NHẤT với directive ═══

Đầu tiên, xác định LOẠI câu hỏi của directive:
- CÂU HỎI LỘ TRÌNH / TIMELINE (vd "lộ trình 12 tháng từ 0 đến 6.0", "kế hoạch 3 tháng") → 5 phần = 5 GIAI ĐOẠN tuần tự theo thời gian. Mỗi phần là 1 mốc cụ thể với tuần/tháng, trọng tâm cần học, milestone đạt được.
- CÂU HỎI KỸ THUẬT / HOW-TO (vd "làm sao phát triển idea trong Speaking Part 2") → 5 phần = đặt vấn đề → kỹ thuật 1 → kỹ thuật 2 → ví dụ thực hành → lỗi & action plan.
- CÂU HỎI SO SÁNH / LỰA CHỌN (vd "PTE vs IELTS, nên thi cái nào?") → 5 phần = so sánh theo từng tiêu chí + khuyến nghị.
- CÂU HỎI GỠ RỐI (vd "tại sao Writing tôi mãi 5.5?") → 5 phần = chẩn đoán → 3 nguyên nhân gốc → cách sửa cho từng nguyên nhân → kế hoạch giải cứu 7 ngày.
- CÂU HỎI GIẢI THÍCH KHÁI NIỆM (vd "IELTS band descriptor là gì?") → 5 phần = ý cốt lõi → cơ chế hoạt động → tại sao quan trọng → ví dụ thật → ảnh hưởng tới luyện tập hằng ngày.

MẶC ĐỊNH nếu không chắc: dùng KỸ THUẬT.

Với loại đã chọn, thiết kế 5 phần mà MỖI PHẦN đẩy directive tiến lên 1 bước cụ thể. Tiêu đề phần phải phản ánh DIRECTIVE — không phản ánh nhãn bài. Ví dụ: directive "lộ trình 12 tháng 0 đến 6.0" → tiêu đề kiểu "Tháng 1-2: Sống sót tiếng Anh trước đã", "Tháng 3-5: Xây nền ngữ pháp + 800 từ cốt lõi", KHÔNG được kiểu "Giới thiệu IELTS Foundation".

═══ NGUYÊN TẮC CHẤT LƯỢNG NGHIÊM NGẶT ═══
1. MỌI phần phải cụ thể đẩy directive tiến lên. Filler chung về nhãn bài bị CẤM.
2. "title" 5-12 từ, PHẢI nêu rõ giai đoạn/kỹ thuật/option cụ thể phần đó nói tới — không nêu nhãn bài chung chung.
3. "content" 80-130 từ tiếng Việt (5-7 câu) — ấm áp, hội thoại, đặc thông tin. KHÔNG sáo rỗng.
4. "key_points" ĐÚNG 4 bullet, mỗi cái 10-18 từ, CỤ THỂ và actionable (vd "Luyện 20 phút Cambridge Listening test 1 mỗi ngày", KHÔNG "luyện nghe thường xuyên").
5. "keywords" ĐÚNG 3 từ tiếng Anh liên quan trực tiếp nội dung phần đó.
6. "example" câu tiếng Anh tự nhiên 12-20 từ minh hoạ ý của phần.
7. "practice_phrase" rỗng "" cho 3 phần; 2 phần có cụm 6-12 từ tiếng Anh để đọc theo.
8. "image_query" 2-4 từ tiếng Anh trực quan khớp phần đó.
9. CẤM mở đầu "content" bằng: "Chào mừng", "Bài học hôm nay", "Trong phần này", "Hãy cùng khám phá", "{topic} là kỳ thi quan trọng", "Nhiều bạn học viên…". Mỗi phần phải mở bằng phát biểu/tình huống cụ thể bám directive.

═══ ĐẦU RA ═══
Chỉ trả về JSON hợp lệ, không thêm chữ nào khác:
{{"sections": [{{"title": "string", "content": "string (80-130 từ tiếng Việt)", "key_points": ["s","s","s","s"], "keywords": [{{"term":"s","meaning":"s"}},{{"term":"s","meaning":"s"}},{{"term":"s","meaning":"s"}}], "example": "string", "practice_phrase": "string", "image_query": "string"}}, ...5 phần]}}

NGÔN NGỮ NGHIÊM NGẶT: title / content / key_points / keywords.meaning BẰNG TIẾNG VIỆT; keywords.term / example / practice_phrase / image_query BẰNG TIẾNG ANH."""


def _fallback_sections(topic: str, level: str, language: str) -> list[dict]:
    if language == "vi":
        return [
            {"title": "Giới thiệu bài học", "practice_phrase": "", "image_query": "classroom welcome teacher",
             "content": f"Chào mừng bạn đến với bài học về chủ đề {topic}. Đây là chủ đề rất hữu ích cho người học tiếng Anh trình độ {level}. Chúng ta sẽ cùng khám phá từng bước một.",
             "key_points": [f"Chủ đề: {topic}", f"Phù hợp trình độ {level}", "Học theo từng bước rõ ràng"],
             "keywords": [{"term": "lesson", "meaning": "bài học"}, {"term": "step by step", "meaning": "từng bước"}],
             "example": f"Today's lesson is about {topic}."},
            {"title": "Từ vựng quan trọng", "practice_phrase": f"Let's learn about {topic}", "image_query": "english vocabulary dictionary book",
             "content": f"Trước tiên, hãy cùng tìm hiểu những từ vựng chính liên quan đến {topic}. Nắm vững từ vựng sẽ giúp bạn hiểu và sử dụng chủ đề này tự tin hơn.",
             "key_points": ["Học từ vựng cốt lõi của chủ đề", "Hiểu nghĩa và cách dùng", "Áp dụng vào giao tiếp thực tế"],
             "keywords": [{"term": "vocabulary", "meaning": "từ vựng"}, {"term": "confident", "meaning": "tự tin"}],
             "example": f"I want to improve my {topic} vocabulary."},
            {"title": "Khái niệm cốt lõi", "practice_phrase": "", "image_query": "concept lightbulb idea brainstorm",
             "content": f"Nội dung chính của {topic} có thể chia thành vài ý đơn giản. Khi hiểu từng ý, bạn sẽ thấy bức tranh tổng thể rõ ràng hơn nhiều.",
             "key_points": ["Chia nhỏ thành ý đơn giản", "Hiểu từng phần một", "Tổng hợp lại bức tranh lớn"],
             "keywords": [{"term": "concept", "meaning": "khái niệm"}, {"term": "overall", "meaning": "tổng thể"}],
             "example": "Understanding the basics makes everything clearer."},
            {"title": "Ví dụ thực tế", "practice_phrase": f"I want to practice {topic} every day", "image_query": "people conversation real life english",
             "content": f"Hãy xem {topic} xuất hiện như thế nào trong tiếng Anh hàng ngày. Các ví dụ này sẽ cho bạn thấy cách dùng những gì đã học hôm nay.",
             "key_points": ["Quan sát ví dụ thực tế", "Học cách dùng trong ngữ cảnh", "Luyện tập hằng ngày"],
             "keywords": [{"term": "example", "meaning": "ví dụ"}, {"term": "practice", "meaning": "luyện tập"}],
             "example": f"Practice {topic} every day for the best results."},
            {"title": "Tóm tắt & Luyện tập", "practice_phrase": "", "image_query": "student success notebook study",
             "content": f"Bạn đã hoàn thành bài học về {topic}! Hãy ôn lại từ vựng, luyện tập các ví dụ và bạn sẽ tiến bộ rất nhanh.",
             "key_points": ["Ôn lại từ vựng đã học", "Luyện tập các ví dụ", "Kiên trì để tiến bộ"],
             "keywords": [{"term": "review", "meaning": "ôn tập"}, {"term": "progress", "meaning": "tiến bộ"}],
             "example": "Review and practice are the keys to progress."},
        ]
    return [
        {"title": "Welcome & Introduction", "practice_phrase": "", "image_query": "classroom welcome teacher",
         "content": f"Welcome to today's lesson about {topic}. This topic is very useful for {level} English learners. Let's explore it step by step together.",
         "key_points": [f"Today's topic: {topic}", f"Designed for {level} learners", "Step-by-step exploration"],
         "keywords": [{"term": "lesson", "meaning": "a unit of teaching"}, {"term": "explore", "meaning": "investigate or study"}],
         "example": f"Today we will explore {topic} together."},
        {"title": "Key Vocabulary", "practice_phrase": f"Let's learn about {topic}", "image_query": "english vocabulary dictionary book",
         "content": f"First, let's look at the most important words related to {topic}. Learning these words will help you understand and talk about this topic with confidence.",
         "key_points": ["Learn the core vocabulary", "Understand meanings and usage", "Speak with confidence"],
         "keywords": [{"term": "vocabulary", "meaning": "set of words known"}, {"term": "confident", "meaning": "sure of yourself"}],
         "example": f"Building vocabulary is essential for mastering {topic}."},
        {"title": "Core Concepts", "practice_phrase": "", "image_query": "concept lightbulb idea brainstorm",
         "content": f"The main ideas behind {topic} can be broken down into a few simple parts. Once you understand each part, the whole picture becomes much clearer.",
         "key_points": ["Break down into simple parts", "Understand each piece", "See the whole picture"],
         "keywords": [{"term": "concept", "meaning": "main idea"}, {"term": "overall", "meaning": "in total"}],
         "example": "Understanding the basics makes complex ideas clearer."},
        {"title": "Real-Life Examples", "practice_phrase": f"I want to practice {topic} every day", "image_query": "people conversation real life english",
         "content": f"Let's see how {topic} appears in everyday English. These examples will show you when and how to use what you have learned today.",
         "key_points": ["Real-world examples", "Learn usage in context", "Daily practice tips"],
         "keywords": [{"term": "example", "meaning": "a sample case"}, {"term": "context", "meaning": "the situation around"}],
         "example": f"You can use {topic} in many everyday situations."},
        {"title": "Summary & Practice Tips", "practice_phrase": "", "image_query": "student success notebook study",
         "content": f"Great job reaching the end of our lesson on {topic}! Review today's vocabulary, practice using the examples, and you will improve quickly.",
         "key_points": ["Review today's vocabulary", "Practice the examples", "Improve through repetition"],
         "keywords": [{"term": "review", "meaning": "look at again"}, {"term": "improve", "meaning": "get better"}],
         "example": "Daily review is the fastest way to improve."},
    ]


async def _generate_lesson(topic: str, lesson_prompt: str, level: str, language: str, settings) -> list[dict]:
    prompt_tpl = _LESSON_PROMPT_VI if language == "vi" else _LESSON_PROMPT_EN
    lesson_focus = lesson_prompt.strip() if lesson_prompt.strip() else f"Teach the topic: {topic}"
    prompt = prompt_tpl.format(topic=topic, lesson_focus=lesson_focus, level=level)
    try:
        raw = await generate_text(
            prompt, settings,
            temperature=0.65, max_tokens=6144, timeout=120,
        )
        parsed = extract_json_object(raw)
        if parsed:
            sections = parsed.get("sections", [])
            if sections:
                return sections
    except Exception as e:
        print(f"[Livestream] Lesson generation failed: {e}")
    return _fallback_sections(topic, level, language)


# ── REST: rooms ────────────────────────────────────────────────────────────────

@router.get("/rooms")
async def list_rooms():
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        rooms = await _list_rooms(r)
        return {
            "rooms": [
                {
                    "id": room["id"],
                    "topic": room["topic"],
                    "lesson_prompt": room.get("lesson_prompt", ""),
                    "level": room["level"],
                    "language": room.get("language", "en"),
                    "level_label": LEVEL_LABELS.get(room["level"], room["level"]),
                    "host_name": room["host_name"],
                    "participant_count": len(_connections.get(room["id"], {})),
                    "status": room["status"],
                    "created_at": room["created_at"],
                }
                for room in rooms
            ]
        }
    finally:
        await r.aclose()


@router.post("/rooms")
async def create_room(body: CreateRoomRequest):
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        room_id = str(uuid.uuid4())[:8].upper()
        room = {
            "id": room_id,
            "topic": body.topic,
            "lesson_prompt": body.lesson_prompt.strip(),
            "level": body.level,
            "language": body.language if body.language in ("en", "vi") else "en",
            "host_id": body.host_id,
            "host_name": body.host_name,
            "status": "waiting",
            "transcript": [],
            "qa": [],
            "created_at": datetime.utcnow().isoformat(),
        }
        await _save_room(r, room)
        return {"room_id": room_id}
    finally:
        await r.aclose()


@router.get("/rooms/{room_id}")
async def get_room(room_id: str):
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        room = await _load_room(r, room_id)
        if not room:
            raise HTTPException(404, "Room not found")
        return {
            **room,
            "level_label": LEVEL_LABELS.get(room["level"], room["level"]),
            "participant_count": len(_connections.get(room_id, {})),
        }
    finally:
        await r.aclose()


# ── REST: recordings ───────────────────────────────────────────────────────────

@router.get("/recordings")
async def list_recordings():
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        recs = await _list_recordings(r)
        return {
            "recordings": [
                {
                    "room_id": rec["room_id"],
                    "topic": rec["topic"],
                    "level": rec["level"],
                    "level_label": rec["level_label"],
                    "host_name": rec["host_name"],
                    "completed_at": rec["completed_at"],
                    "section_count": len(rec["sections"]),
                    "qa_count": len(rec.get("qa", [])),
                    "duration_seconds": sum(s.get("duration", 0) for s in rec["sections"]),
                }
                for rec in recs
            ]
        }
    finally:
        await r.aclose()


@router.get("/recordings/{room_id}")
async def get_recording(room_id: str):
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        rec = await _load_recording(r, room_id)
        if not rec:
            raise HTTPException(404, "Recording not found")
        return rec
    finally:
        await r.aclose()


# ── REST: audio ────────────────────────────────────────────────────────────────

@router.get("/audio/{filename}")
async def serve_audio(filename: str):
    if any(c in filename for c in ("/", "\\", "..")):
        raise HTTPException(400, "Invalid filename")
    path = AUDIO_DIR / filename
    if not path.exists():
        raise HTTPException(404, "Audio not found")
    return FileResponse(path, media_type="audio/mpeg")


# ── REST: word translation ────────────────────────────────────────────────────

@router.post("/translate")
async def translate_word(body: TranslateRequest):
    from app.config import get_settings
    settings = get_settings()

    word = body.word.strip()
    if not word or len(word) > 80:
        raise HTTPException(400, "Invalid word")

    cache_key = f"livestream:translate:{body.target}:{word.lower()}"
    r = await _get_redis(settings)
    try:
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)

        if body.target == "vi":
            prompt = (
                f'Translate the English word or short phrase "{word}" into Vietnamese.\n'
                "Respond ONLY with valid JSON, no extra text:\n"
                '{"meaning": "Vietnamese meaning (1 short line)", "pronunciation": "IPA or empty", "example": "one short English example sentence"}'
            )
        else:
            prompt = (
                f'Define the English word or short phrase "{word}".\n'
                "Respond ONLY with valid JSON, no extra text:\n"
                '{"meaning": "concise English definition", "pronunciation": "IPA or empty", "example": "one short example sentence"}'
            )

        result = {"word": word, "meaning": "", "pronunciation": "", "example": ""}
        try:
            raw = await generate_text(
                prompt, settings,
                temperature=0.2, max_tokens=160, timeout=15,
            )
            parsed = extract_json_object(raw)
            if parsed:
                result["meaning"] = str(parsed.get("meaning", "")).strip()
                result["pronunciation"] = str(parsed.get("pronunciation", "")).strip()
                result["example"] = str(parsed.get("example", "")).strip()
        except Exception as e:
            print(f"[Translate] LLM error: {e}")

        if not result["meaning"]:
            result["meaning"] = word  # graceful fallback

        await r.set(cache_key, json.dumps(result), ex=7 * 86400)
        return result
    finally:
        await r.aclose()


# ── WebSocket ──────────────────────────────────────────────────────────────────

@router.websocket("/rooms/{room_id}/ws")
async def room_ws(websocket: WebSocket, room_id: str, token: str = Query(default="")):
    from app.config import get_settings
    settings = get_settings()

    r = await _get_redis(settings)
    user_id: str | None = None

    try:
        room = await _load_room(r, room_id)
        if not room:
            await websocket.close(code=4004)
            return

        payload = _verify_jwt(token, settings.jwt_secret, settings.jwt_algorithm)
        if settings.jwt_secret and not payload:
            await websocket.close(code=4001)
            return

        if len(_connections.get(room_id, {})) >= settings.max_room_participants:
            await websocket.close(code=4003)
            return

        await websocket.accept()

        try:
            raw = await asyncio.wait_for(websocket.receive_json(), timeout=10)
        except asyncio.TimeoutError:
            await websocket.close(code=4001)
            return

        if raw.get("type") != "join":
            await websocket.close(code=4001)
            return

        user_id = (payload or {}).get("sub") or raw.get("user_id") or str(uuid.uuid4())
        user_name = raw.get("user_name", "Student")

        _connections.setdefault(room_id, {})[user_id] = websocket
        _user_names.setdefault(room_id, {})[user_id] = user_name

        room = await _load_room(r, room_id) or room
        await websocket.send_json({
            "type": "room_state",
            "room": {**room, "level_label": LEVEL_LABELS.get(room["level"], room["level"])},
            "participant_count": len(_connections.get(room_id, {})),
            "is_host": user_id == room["host_id"],
        })
        await _broadcast(room_id, {
            "type": "participant_join",
            "user_name": user_name,
            "participant_count": len(_connections.get(room_id, {})),
        })
        await _broadcast_participants(room_id, room["host_id"])

        while True:
            msg = await websocket.receive_json()
            msg_type = msg.get("type")

            if msg_type == "start_lesson":
                room = await _load_room(r, room_id) or room
                if user_id == room["host_id"] and room["status"] == "waiting":
                    room["status"] = "live"
                    await _save_room(r, room)
                    await _broadcast(room_id, {"type": "lesson_start"})
                    asyncio.create_task(_deliver_lesson(room_id, settings))

            elif msg_type == "ask_question":
                question = msg.get("question", "").strip()
                if not question:
                    continue
                if await _is_rate_limited(r, user_id, settings.questions_per_minute):
                    await websocket.send_json({"type": "error", "message": "Too many questions — please wait."})
                    continue
                # Auto-lower hand if user was in the queue
                queue = _raised_hands.get(room_id, [])
                if user_id in queue:
                    queue.remove(user_id)
                    await _broadcast_participants(room_id, room["host_id"])
                asyncio.create_task(_answer_question(room_id, question, user_name, settings))

            elif msg_type == "reaction":
                emoji = msg.get("emoji", "")
                if emoji in ALLOWED_REACTIONS:
                    await _broadcast(room_id, {
                        "type": "reaction",
                        "emoji": emoji,
                        "user_id": user_id,
                        "user_name": user_name,
                    })

            elif msg_type == "raise_hand":
                queue = _raised_hands.setdefault(room_id, [])
                if user_id not in queue:
                    queue.append(user_id)
                    await _broadcast_participants(room_id, room["host_id"])

            elif msg_type == "lower_hand":
                queue = _raised_hands.get(room_id, [])
                if user_id in queue:
                    queue.remove(user_id)
                    await _broadcast_participants(room_id, room["host_id"])

            elif msg_type == "invite_speaker":
                # Host calls on a student who raised their hand
                room = await _load_room(r, room_id) or room
                if user_id != room["host_id"]:
                    continue
                target_id = msg.get("target_user_id")
                if not target_id:
                    continue
                queue = _raised_hands.get(room_id, [])
                if target_id in queue:
                    queue.remove(target_id)
                target_name = _user_names.get(room_id, {}).get(target_id, "Student")
                await _broadcast(room_id, {
                    "type": "speaker_invited",
                    "target_user_id": target_id,
                    "target_user_name": target_name,
                })
                await _broadcast_participants(room_id, room["host_id"])

            elif msg_type == "practice_result":
                # Student submitted a practice attempt — broadcast for everyone to see
                await _broadcast(room_id, {
                    "type": "practice_result",
                    "user_id": user_id,
                    "user_name": user_name,
                    "phrase": msg.get("phrase", ""),
                    "transcript": msg.get("transcript", ""),
                    "score": msg.get("score", 0),
                })

            elif msg_type == "end_room":
                room = await _load_room(r, room_id) or room
                if user_id == room["host_id"]:
                    room["status"] = "ended"
                    await _save_room(r, room)
                    await _broadcast(room_id, {"type": "room_ended"})
                    break

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[Livestream WS] Error: {e}")
    finally:
        await r.aclose()
        if user_id:
            _connections.get(room_id, {}).pop(user_id, None)
            _user_names.get(room_id, {}).pop(uid := user_id, None)
            queue = _raised_hands.get(room_id, [])
            if uid in queue:
                queue.remove(uid)
            await _broadcast(room_id, {
                "type": "participant_leave",
                "participant_count": len(_connections.get(room_id, {})),
            })
            r2 = await _get_redis(__import__('app.config', fromlist=['get_settings']).get_settings())
            try:
                room = await _load_room(r2, room_id)
                if room:
                    await _broadcast_participants(room_id, room["host_id"])
                    if uid == room["host_id"] and room["status"] not in ("ended", "completed"):
                        room["status"] = "ended"
                        await _save_room(r2, room)
                        await _broadcast(room_id, {"type": "room_ended"})
            finally:
                await r2.aclose()


# ── Background: deliver lesson ─────────────────────────────────────────────────

async def _deliver_lesson(room_id: str, settings):
    r = await _get_redis(settings)
    try:
        room = await _load_room(r, room_id)
        if not room:
            return

        lang = room.get("language", "en")
        level = room.get("level", "intermediate")
        await _broadcast(room_id, {"type": "lesson_generating"})

        sections = await _generate_lesson(
            room["topic"], room.get("lesson_prompt", ""), room["level"], lang,
            settings,
        )

        # Fetch slide images in parallel (graceful if Pexels key missing or fails)
        image_queries = [str(s.get("image_query", "")).strip() or room["topic"] for s in sections]
        try:
            image_urls = await fetch_images_for_queries(image_queries, settings.pexels_api_key)
        except Exception as e:
            print(f"[Livestream] Image fetch failed: {e}")
            image_urls = ["" for _ in sections]

        sections_with_timing: list[dict] = []

        for i, section in enumerate(sections):
            room = await _load_room(r, room_id)
            if not room or room["status"] == "ended":
                break

            text = f"{section['title']}. {section['content']}"
            duration = max(4.0, len(text.split()) / 2.3)

            audio_url = ""
            try:
                filename = await synthesize_to_file(
                    _normalize_tts(text), level, lang,
                    provider=settings.tts_provider,
                    credentials_path=settings.google_application_credentials,
                )
                audio_url = f"{settings.audio_base_url}/api/livestream/audio/{filename}"
            except Exception as e:
                print(f"[TTS] Failed: {e}")

            practice_phrase = str(section.get("practice_phrase", "")).strip()
            key_points = [str(p).strip() for p in section.get("key_points", []) if str(p).strip()][:5]
            keywords_raw = section.get("keywords", []) or []
            keywords: list[dict] = []
            for kw in keywords_raw[:4]:
                if isinstance(kw, dict):
                    term = str(kw.get("term", "")).strip()
                    meaning = str(kw.get("meaning", "")).strip()
                    if term and meaning:
                        keywords.append({"term": term, "meaning": meaning})
            example = str(section.get("example", "")).strip()

            slide_payload = {
                "key_points": key_points,
                "keywords": keywords,
                "example": example,
                "image_url": image_urls[i] if i < len(image_urls) else "",
            }

            sections_with_timing.append({
                "index": i,
                "title": section["title"],
                "content": section["content"],
                "practice_phrase": practice_phrase,
                "audio_url": audio_url,
                "duration": duration,
                **slide_payload,
            })

            room["transcript"].append({
                "title": section["title"],
                "content": section["content"],
                "practice_phrase": practice_phrase,
                **slide_payload,
            })
            await _save_room(r, room)

            await _broadcast(room_id, {
                "type": "lesson_chunk",
                "index": i,
                "total": len(sections),
                "title": section["title"],
                "content": section["content"],
                "practice_phrase": practice_phrase,
                "audio_url": audio_url,
                **slide_payload,
            })

            await asyncio.sleep(duration)

        room = await _load_room(r, room_id)
        if room and room["status"] == "live":
            qa_seconds = 300  # 5-minute open Q&A window
            await _broadcast(room_id, {
                "type": "qa_period_start",
                "duration_seconds": qa_seconds,
            })

            # Poll every 10 s; exit early if host manually ended the room
            elapsed = 0
            while elapsed < qa_seconds:
                await asyncio.sleep(10)
                elapsed += 10
                room = await _load_room(r, room_id)
                if not room or room["status"] == "ended":
                    return

            room = await _load_room(r, room_id)
            if room and room["status"] == "live":
                await _save_recording(r, room, sections_with_timing)
                room["status"] = "completed"
                await _save_room(r, room)
                await _broadcast(room_id, {"type": "lesson_complete"})
    finally:
        await r.aclose()


# ── Background: answer question ────────────────────────────────────────────────

async def _answer_question(room_id: str, question: str, user_name: str, settings):
    r = await _get_redis(settings)
    try:
        room = await _load_room(r, room_id)
        if not room:
            return

        await _broadcast(room_id, {"type": "question_asked", "user_name": user_name, "question": question})

        lang = room.get("language", "en")
        level = room.get("level", "intermediate")

        lesson_directive = room.get("lesson_prompt", "") or room["topic"]
        recent_transcript = ""
        if room.get("transcript"):
            last_sections = room["transcript"][-2:]
            recent_transcript = " | ".join(
                f"{s.get('title','')}: {s.get('content','')[:200]}" for s in last_sections
            )

        if lang == "vi":
            prompt = (
                f'Bạn là giáo viên tiếng Anh trực tiếp đang dạy lớp livestream.\n'
                f'Tiêu đề bài: "{room["topic"]}". Trình độ học viên: {room["level"]}.\n'
                f'Nội dung trọng tâm của buổi học: {lesson_directive}\n'
                + (f'Nội dung vừa giảng gần đây: {recent_transcript}\n' if recent_transcript else '')
                + f'\nHọc viên "{user_name}" vừa hỏi: "{question}"\n\n'
                "NHIỆM VỤ: trả lời bằng tiếng Việt, 4-6 câu (khoảng 80-120 từ).\n"
                "YÊU CẦU:\n"
                "1. Trả lời TRỰC TIẾP câu hỏi, không vòng vo.\n"
                "2. Bám sát nội dung trọng tâm của buổi học — đừng lan man.\n"
                "3. Đưa ra ÍT NHẤT 1 ví dụ tiếng Anh cụ thể (kèm dịch nếu cần).\n"
                "4. Kết bằng một gợi ý hành động cụ thể (hôm nay/tuần này nên luyện gì).\n"
                "5. Văn phong ấm áp, thân thiện nhưng đặc thông tin. KHÔNG mở đầu bằng 'Câu hỏi hay lắm', 'Cảm ơn câu hỏi'.\n"
                "Chỉ trả lời văn xuôi thuần túy, không markdown, không tiêu đề."
            )
            fallback = f"Đây là câu hỏi rất sát với chủ đề hôm nay. Bạn thử áp dụng các kỹ thuật vừa học vào câu hỏi này nhé — viết ra giấy 2-3 câu trả lời thử rồi so sánh."
        else:
            prompt = (
                f'You are a live English teacher mid-lesson.\n'
                f'Lesson title: "{room["topic"]}". Level: {room["level"]}.\n'
                f'Lesson focus: {lesson_directive}\n'
                + (f'Recent slides: {recent_transcript}\n' if recent_transcript else '')
                + f'\nStudent "{user_name}" just asked: "{question}"\n\n'
                "TASK: answer in 4-6 sentences (around 80-120 words).\n"
                "REQUIREMENTS:\n"
                "1. Answer the question DIRECTLY, no preamble.\n"
                "2. Stay anchored to the lesson focus above — no tangents.\n"
                "3. Include AT LEAST one concrete English example.\n"
                "4. Close with a specific actionable next step (something to practice today/this week).\n"
                "5. Warm but information-dense. Do NOT open with 'Great question' or 'Thanks for asking'.\n"
                "Plain prose only, no markdown, no headings."
            )
            fallback = f"That question is right on track with today's focus. Try applying the techniques from the lesson — write out 2-3 attempts and compare them to spot the pattern."

        answer = ""
        try:
            answer = await generate_text(
                prompt, settings,
                temperature=0.55, max_tokens=640, timeout=45,
            )
        except Exception as e:
            print(f"[Q&A] LLM error: {e}")

        if not answer:
            answer = fallback

        audio_url = ""
        try:
            filename = await synthesize_to_file(
                _normalize_tts(answer), level, lang,
                provider=settings.tts_provider,
                credentials_path=settings.google_application_credentials,
            )
            audio_url = f"{settings.audio_base_url}/api/livestream/audio/{filename}"
        except Exception as e:
            print(f"[TTS Q&A] Failed: {e}")

        # Persist Q&A to room so it's included in recording
        room = await _load_room(r, room_id)
        if room:
            room.setdefault("qa", []).append({
                "user_name": user_name,
                "question": question,
                "answer": answer,
                "audio_url": audio_url,
            })
            await _save_room(r, room)

        await _broadcast(room_id, {
            "type": "ai_answer",
            "question": question,
            "user_name": user_name,
            "answer": answer,
            "audio_url": audio_url,
        })
    finally:
        await r.aclose()

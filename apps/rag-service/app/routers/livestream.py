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
import hashlib
import json
import re
import time
import uuid
from datetime import datetime
from pathlib import Path

try:
    from mutagen.mp3 import MP3
    _MUTAGEN_AVAILABLE = True
except ImportError:
    MP3 = None  # type: ignore
    _MUTAGEN_AVAILABLE = False

import jwt as pyjwt
from fastapi import APIRouter, Header, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from pydantic import BaseModel
import redis.asyncio as aioredis

from app.services.tts_service import AUDIO_DIR, synthesize_to_file
from app.services.llm_service import generate_text, extract_json_object
from app.services.image_service import fetch_images_for_queries
from app.services.storage import store_audio_and_url

router = APIRouter(prefix="/api/livestream", tags=["Livestream"])

# ── In-process WebSocket registry (LOCAL sockets only) ────────────────────────
# Only the live WebSocket objects live in-process. All *shared* room state
# (presence + raised-hand queue) lives in Redis so the feature behaves correctly
# across multiple uvicorn workers / replicas, and broadcasting goes through
# Redis Pub/Sub (see _broadcast / _pubsub_listener) so a message published on one
# worker reaches sockets connected to any other worker.
_connections: dict[str, dict[str, WebSocket]] = {}

# Reactions allowlist — only these emojis can be broadcast
ALLOWED_REACTIONS = {"👍", "❤️", "👏", "🎉", "🤔", "😮", "🔥", "😂"}


# ── Redis-backed presence + raised-hand queue ─────────────────────────────────

def _presence_key(room_id: str) -> str:
    return f"livestream:presence:{room_id}"


def _hands_key(room_id: str) -> str:
    return f"livestream:hands:{room_id}"


def _speaker_key(room_id: str) -> str:
    """The student currently invited to speak (spotlight). TTL-bounded."""
    return f"livestream:speaker:{room_id}"


SPEAKER_TTL = 300  # 5-minute spotlight window


async def _presence_count(r: aioredis.Redis, room_id: str) -> int:
    return await r.hlen(_presence_key(room_id))


async def _add_presence(r: aioredis.Redis, room_id: str, user_id: str, user_name: str):
    await r.hset(_presence_key(room_id), user_id, user_name)
    await r.expire(_presence_key(room_id), ROOM_TTL)


async def _remove_presence(r: aioredis.Redis, room_id: str, user_id: str):
    await r.hdel(_presence_key(room_id), user_id)
    await r.lrem(_hands_key(room_id), 0, user_id)


async def _is_present(r: aioredis.Redis, room_id: str, user_id: str) -> bool:
    return await r.hexists(_presence_key(room_id), user_id)


async def _raise_hand(r: aioredis.Redis, room_id: str, user_id: str) -> bool:
    """Append to the queue if not already present. Returns True if newly added."""
    if user_id in await r.lrange(_hands_key(room_id), 0, -1):
        return False
    await r.rpush(_hands_key(room_id), user_id)
    await r.expire(_hands_key(room_id), ROOM_TTL)
    return True


async def _lower_hand(r: aioredis.Redis, room_id: str, user_id: str) -> bool:
    """Remove from the queue. Returns True if it was present."""
    return (await r.lrem(_hands_key(room_id), 0, user_id)) > 0


async def _participants_payload(r: aioredis.Redis, room_id: str, host_id: str) -> list[dict]:
    """Build participant list snapshot for a room from Redis presence."""
    names = await r.hgetall(_presence_key(room_id))
    raised = await r.lrange(_hands_key(room_id), 0, -1)
    return [
        {
            "user_id": uid,
            "user_name": name or "Student",
            "is_host": uid == host_id,
            "hand_raised": uid in raised,
            "hand_position": (raised.index(uid) + 1) if uid in raised else 0,
        }
        for uid, name in names.items()
    ]


async def _broadcast_participants(r: aioredis.Redis, room_id: str, host_id: str):
    await _broadcast(room_id, {
        "type": "participant_list",
        "participants": await _participants_payload(r, room_id, host_id),
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
    rooms: list[dict] = []
    for v in values:
        if not v:
            continue
        try:
            room = json.loads(v)
        except json.JSONDecodeError:
            continue
        if room.get("status") != "ended":
            rooms.append(room)
    return rooms


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


# ── Broadcast via Redis Pub/Sub ──────────────────────────────────────────────
# _broadcast publishes to a per-room channel; every worker runs _pubsub_listener
# which delivers the message to its *local* sockets. This is what makes a room
# work across multiple uvicorn workers — an in-process dict broadcast would only
# reach the sockets that happen to live on the same worker as the publisher.

_pub_redis: aioredis.Redis | None = None


def _channel(room_id: str) -> str:
    return f"livestream:channel:{room_id}"


async def _get_pub_redis() -> aioredis.Redis:
    global _pub_redis
    if _pub_redis is None:
        from app.config import get_settings
        _pub_redis = aioredis.from_url(get_settings().redis_url, decode_responses=True)
    return _pub_redis


async def _broadcast(room_id: str, message: dict):
    """Publish a message to every participant of a room, across all workers."""
    try:
        r = await _get_pub_redis()
        await r.publish(_channel(room_id), json.dumps({"room_id": room_id, "message": message}))
    except Exception as e:
        # Redis unreachable — degrade gracefully to local-only delivery.
        print(f"[Livestream] publish failed, local-only delivery: {e}")
        await _local_deliver(room_id, message)


async def _local_deliver(room_id: str, message: dict):
    """Send a message to the sockets connected to THIS worker."""
    dead = []
    for uid, ws in list(_connections.get(room_id, {}).items()):
        try:
            await ws.send_json(message)
        except Exception:
            dead.append(uid)
    for uid in dead:
        _connections.get(room_id, {}).pop(uid, None)


async def _pubsub_listener():
    """Per-process loop: receive published room messages and fan out to local sockets."""
    from app.config import get_settings
    settings = get_settings()
    while True:
        try:
            r = aioredis.from_url(settings.redis_url, decode_responses=True)
            pubsub = r.pubsub()
            await pubsub.psubscribe("livestream:channel:*")
            print("[Livestream] Pub/Sub listener subscribed")
            async for msg in pubsub.listen():
                if msg.get("type") != "pmessage":
                    continue
                try:
                    data = json.loads(msg["data"])
                    await _local_deliver(data["room_id"], data["message"])
                except Exception as e:
                    print(f"[Livestream] deliver error: {e}")
        except Exception as e:
            print(f"[Livestream] Pub/Sub listener crashed, restarting in 5s: {e}")
            await asyncio.sleep(5)


def start_pubsub_listener():
    """Kick off the per-process Pub/Sub listener (called from app startup)."""
    asyncio.create_task(_pubsub_listener())


# ── Audio duration ───────────────────────────────────────────────────────────

def _audio_duration(filename: str, fallback: float) -> float:
    """Real MP3 length in seconds (so slides advance in sync with the narration).

    Falls back to a word-count estimate if mutagen is unavailable or the file
    can't be read.
    """
    if not filename or not _MUTAGEN_AVAILABLE:
        return fallback
    try:
        return max(2.0, float(MP3(AUDIO_DIR / filename).info.length))
    except Exception:
        return fallback


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


async def _generate_lesson(
    r: aioredis.Redis, topic: str, lesson_prompt: str, level: str, language: str, settings,
) -> tuple[list[dict], bool]:
    """Returns (sections, used_fallback). used_fallback=True means the AI call
    failed/returned unusable output and we served the generic template instead.

    Generated lessons are cached in Redis keyed by (language, level, topic,
    prompt) for 7 days, so re-running the same lesson skips the expensive LLM call.
    """
    cache_key = "livestream:lesson:" + hashlib.sha1(
        f"{language}|{level}|{topic.strip()}|{lesson_prompt.strip()}".encode("utf-8")
    ).hexdigest()
    try:
        cached = await r.get(cache_key)
        if cached:
            secs = json.loads(cached)
            if secs:
                return secs, False
    except Exception:
        pass

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
                try:
                    await r.set(cache_key, json.dumps(sections), ex=7 * 86400)
                except Exception:
                    pass
                return sections, False
    except Exception as e:
        print(f"[Livestream] Lesson generation failed: {e}")
    return _fallback_sections(topic, level, language), True


# ── REST: rooms ────────────────────────────────────────────────────────────────

@router.get("/rooms")
async def list_rooms():
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        rooms = await _list_rooms(r)
        out = []
        for room in rooms:
            out.append({
                "id": room["id"],
                "topic": room["topic"],
                "lesson_prompt": room.get("lesson_prompt", ""),
                "level": room["level"],
                "language": room.get("language", "en"),
                "level_label": LEVEL_LABELS.get(room["level"], room["level"]),
                "host_name": room["host_name"],
                "participant_count": await _presence_count(r, room["id"]),
                "status": room["status"],
                "created_at": room["created_at"],
            })
        return {"rooms": out}
    finally:
        await r.aclose()


@router.post("/rooms")
async def create_room(body: CreateRoomRequest, authorization: str = Header(default="")):
    from app.config import get_settings
    settings = get_settings()

    # Derive host identity from the JWT (anti-spoof). When a secret is configured
    # a valid token is REQUIRED to create/host a room and the client-supplied
    # host_id is ignored. Optionally restrict hosting to specific roles. In
    # no-JWT dev mode we fall back to the body value.
    token = authorization[7:].strip() if authorization.lower().startswith("bearer ") else authorization
    payload = _verify_jwt(token, settings.jwt_secret, settings.jwt_algorithm)
    if settings.jwt_secret:
        if not payload:
            raise HTTPException(401, "Authentication required to create a room")
        host_id = str(payload.get("userId") or payload.get("sub") or "")
        allowed = [x.strip().upper() for x in settings.livestream_host_roles.split(",") if x.strip()]
        if allowed and str(payload.get("role") or "").upper() not in allowed:
            raise HTTPException(403, "Your account is not allowed to host a live room")
    else:
        host_id = body.host_id
    if not host_id:
        raise HTTPException(400, "Missing host identity")

    r = await _get_redis(settings)
    try:
        room_id = str(uuid.uuid4())[:8].upper()
        room = {
            "id": room_id,
            "topic": body.topic,
            "lesson_prompt": body.lesson_prompt.strip(),
            "level": body.level,
            "language": body.language if body.language in ("en", "vi") else "en",
            "host_id": host_id,
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
            "participant_count": await _presence_count(r, room_id),
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

        if await _presence_count(r, room_id) >= settings.max_room_participants:
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

        # Identity: when a JWT is present we trust ONLY its claim, so a client
        # cannot spoof another user (e.g. the host) by sending an arbitrary
        # user_id. identity-service issues `userId`; `sub` kept as a fallback.
        # The client-supplied id is honoured only in no-JWT dev mode.
        token_uid = (payload or {}).get("userId") or (payload or {}).get("sub")
        if token_uid:
            user_id = str(token_uid)
        else:
            user_id = raw.get("user_id") or str(uuid.uuid4())
        user_name = raw.get("user_name", "Student")

        _connections.setdefault(room_id, {})[user_id] = websocket
        await _add_presence(r, room_id, user_id, user_name)

        room = await _load_room(r, room_id) or room
        count = await _presence_count(r, room_id)
        await websocket.send_json({
            "type": "room_state",
            "room": {**room, "level_label": LEVEL_LABELS.get(room["level"], room["level"])},
            "participant_count": count,
            "is_host": user_id == room["host_id"],
        })
        await _broadcast(room_id, {
            "type": "participant_join",
            "user_name": user_name,
            "participant_count": count,
        })
        await _broadcast_participants(r, room_id, room["host_id"])

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
                if await _lower_hand(r, room_id, user_id):
                    await _broadcast_participants(r, room_id, room["host_id"])
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
                if await _raise_hand(r, room_id, user_id):
                    await _broadcast_participants(r, room_id, room["host_id"])

            elif msg_type == "lower_hand":
                if await _lower_hand(r, room_id, user_id):
                    await _broadcast_participants(r, room_id, room["host_id"])

            elif msg_type == "invite_speaker":
                # Host calls on a student who raised their hand
                room = await _load_room(r, room_id) or room
                if user_id != room["host_id"]:
                    continue
                target_id = msg.get("target_user_id")
                if not target_id:
                    continue
                await _lower_hand(r, room_id, target_id)
                target_name = await r.hget(_presence_key(room_id), target_id) or "Student"
                # Mark this student as the current spotlight speaker so the server
                # accepts live transcripts only from them.
                await r.set(_speaker_key(room_id), target_id, ex=SPEAKER_TTL)
                await _broadcast(room_id, {
                    "type": "speaker_invited",
                    "target_user_id": target_id,
                    "target_user_name": target_name,
                })
                await _broadcast_participants(r, room_id, room["host_id"])

            elif msg_type == "speaker_transcript":
                # Live speech-to-text from the spotlighted student, relayed to the
                # whole room. On the final chunk the spoken text is handed to the AI
                # exactly like a typed question, and the spotlight is released.
                if await r.get(_speaker_key(room_id)) != user_id:
                    continue
                text = str(msg.get("text", "")).strip()[:300]
                final = bool(msg.get("final"))
                await _broadcast(room_id, {
                    "type": "speaker_transcript",
                    "user_id": user_id,
                    "user_name": user_name,
                    "text": text,
                    "final": final,
                })
                if final:
                    await r.delete(_speaker_key(room_id))
                    await _broadcast(room_id, {"type": "speaker_ended", "user_id": user_id})
                    if text and not await _is_rate_limited(r, user_id, settings.questions_per_minute):
                        asyncio.create_task(_answer_question(room_id, text, user_name, settings))

            elif msg_type == "end_speaking":
                # Speaker (or host) cancels the spotlight without submitting.
                room = await _load_room(r, room_id) or room
                current = await r.get(_speaker_key(room_id))
                if current and (current == user_id or user_id == room["host_id"]):
                    await r.delete(_speaker_key(room_id))
                    await _broadcast(room_id, {"type": "speaker_ended", "user_id": current})

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
        if user_id:
            _connections.get(room_id, {}).pop(user_id, None)
            await _remove_presence(r, room_id, user_id)
            count = await _presence_count(r, room_id)
            await _broadcast(room_id, {
                "type": "participant_leave",
                "participant_count": count,
            })
            room = await _load_room(r, room_id)
            if room:
                await _broadcast_participants(r, room_id, room["host_id"])
                # Host left: don't kill the room instantly — give a grace window
                # for a reconnect (network blip / refresh) before ending it.
                if user_id == room["host_id"] and room["status"] not in ("ended", "completed"):
                    asyncio.create_task(_end_room_if_host_absent(room_id, user_id, settings))
        await r.aclose()


# ── Host disconnect grace ──────────────────────────────────────────────────────

HOST_GRACE_SECONDS = 45


async def _end_room_if_host_absent(room_id: str, host_id: str, settings):
    """End the room only if the host hasn't reconnected within the grace window.

    Prevents a brief host network blip / page refresh from killing the room for
    everyone. Presence is checked in Redis, so a host that reconnects on a
    different worker is still detected.
    """
    await asyncio.sleep(HOST_GRACE_SECONDS)
    r = await _get_redis(settings)
    try:
        if await _is_present(r, room_id, host_id):
            return  # host came back — keep the room alive
        room = await _load_room(r, room_id)
        if room and room["status"] not in ("ended", "completed"):
            room["status"] = "ended"
            await _save_room(r, room)
            await _broadcast(room_id, {"type": "room_ended"})
    finally:
        await r.aclose()


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

        sections, used_fallback = await _generate_lesson(
            r, room["topic"], room.get("lesson_prompt", ""), room["level"], lang,
            settings,
        )
        if used_fallback:
            # AI generation failed — tell clients we're serving generic content so
            # the UI can surface it instead of silently looking "done".
            await _broadcast(room_id, {"type": "lesson_info", "fallback": True})

        # Kick off image fetch AND TTS synth for all sections in parallel.
        # Without this, each section had to wait for the next section's TTS to finish
        # (~5-10s gap of silence between sections). Doing them all upfront removes the gap.
        image_queries = [str(s.get("image_query", "")).strip() or room["topic"] for s in sections]
        section_texts = [f"{s['title']}. {s['content']}" for s in sections]

        async def _safe_synth(text: str) -> str:
            try:
                return await synthesize_to_file(
                    _normalize_tts(text), level, lang,
                    provider=settings.tts_provider,
                    credentials_path=settings.google_application_credentials,
                )
            except Exception as e:
                print(f"[TTS] Pre-synth failed: {e}")
                return ""

        image_task = asyncio.create_task(
            fetch_images_for_queries(image_queries, settings.pexels_api_key)
        )
        tts_filenames = await asyncio.gather(*(_safe_synth(t) for t in section_texts))
        try:
            image_urls = await image_task
        except Exception as e:
            print(f"[Livestream] Image fetch failed: {e}")
            image_urls = ["" for _ in sections]

        # Upload each clip to S3 (when configured) so any worker — and the replay
        # page days later — can serve it; falls back to the local audio route.
        audio_urls: list[str] = []
        for fn in tts_filenames:
            if fn:
                audio_urls.append(await store_audio_and_url(AUDIO_DIR / fn, fn, settings.audio_base_url))
            else:
                audio_urls.append("")

        sections_with_timing: list[dict] = []

        for i, section in enumerate(sections):
            room = await _load_room(r, room_id)
            if not room or room["status"] == "ended":
                break

            text = section_texts[i]
            # Pace slide transitions by the REAL audio length (+0.5s tail) so the
            # narration never gets cut off by the next slide, and there are no long
            # silent gaps. Falls back to a word-count estimate if the MP3 can't be read.
            estimate = max(4.0, len(text.split()) / 2.3)
            duration = _audio_duration(tts_filenames[i], estimate) + 0.5
            audio_url = audio_urls[i]

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
                "NHIỆM VỤ: trả lời ĐẦY ĐỦ và CHI TIẾT bằng tiếng Việt.\n"
                "YÊU CẦU:\n"
                "1. PHẢI giải đáp TẤT CẢ các ý có trong câu hỏi — không bỏ sót phần nào. "
                "Nếu câu hỏi có nhiều phần (vd 'A là gì và làm sao B'), trả lời riêng từng phần.\n"
                "2. Độ dài tự điều chỉnh theo độ phức tạp của câu hỏi:\n"
                "   - Câu hỏi đơn giản (định nghĩa, yes/no, 1 ý) → 4-6 câu.\n"
                "   - Câu hỏi how-to / nhiều phần → 8-15 câu, chia 2-3 đoạn, các đoạn cách nhau bằng dòng trống.\n"
                "   - Câu hỏi sâu (so sánh, phân tích, lộ trình) → 15-30 câu, chia 3-5 đoạn rõ ràng.\n"
                "3. Bám sát nội dung trọng tâm buổi học — KHÔNG lan man sang chủ đề khác.\n"
                "4. Đưa ra ÍT NHẤT 1 ví dụ tiếng Anh cụ thể (kèm dịch nếu cần). Câu hỏi phức tạp → 2-3 ví dụ.\n"
                "5. Kết bằng gợi ý hành động cụ thể (việc nên làm trong 24h hoặc tuần này).\n"
                "6. Văn phong ấm áp, hội thoại, thân thiện nhưng ĐẶC THÔNG TIN. "
                "KHÔNG mở đầu bằng 'Câu hỏi hay lắm', 'Cảm ơn câu hỏi', 'Đây là một câu hỏi…'.\n"
                "7. Văn xuôi thuần tuý — KHÔNG dùng markdown, KHÔNG dùng dấu *, #, hay danh sách bullet. "
                "Phân đoạn bằng dòng trống.\n"
                "8. TUYỆT ĐỐI không dừng giữa chừng. Trả lời PHẢI có mở-thân-kết hoàn chỉnh."
            )
            fallback = (
                "Đây là câu hỏi rất sát với chủ đề hôm nay. Bạn thử áp dụng các kỹ thuật "
                "vừa học vào câu hỏi này nhé — viết ra giấy 2-3 câu trả lời thử rồi so sánh."
            )
        else:
            prompt = (
                f'You are a live English teacher mid-lesson.\n'
                f'Lesson title: "{room["topic"]}". Level: {room["level"]}.\n'
                f'Lesson focus: {lesson_directive}\n'
                + (f'Recent slides: {recent_transcript}\n' if recent_transcript else '')
                + f'\nStudent "{user_name}" just asked: "{question}"\n\n'
                "TASK: answer THOROUGHLY and COMPLETELY in English.\n"
                "REQUIREMENTS:\n"
                "1. You MUST address EVERY part of the question — leave nothing out. "
                "If the question has multiple parts, answer each part separately.\n"
                "2. Length adapts to complexity:\n"
                "   - Simple question (definition, yes/no, single point) → 4-6 sentences.\n"
                "   - How-to / multi-part question → 8-15 sentences, 2-3 paragraphs separated by blank lines.\n"
                "   - Deep question (comparison, analysis, roadmap) → 15-30 sentences, 3-5 clear paragraphs.\n"
                "3. Stay anchored to the lesson focus — no tangents.\n"
                "4. Include AT LEAST one concrete English example. Complex questions → 2-3 examples.\n"
                "5. Close with a specific actionable next step (something to practice in the next 24 hours / this week).\n"
                "6. Warm, conversational, friendly — but INFORMATION-DENSE. "
                "Do NOT open with 'Great question', 'Thanks for asking', 'That's a great question…'.\n"
                "7. Plain prose only — NO markdown, NO *, #, no bullet lists. Separate paragraphs with blank lines.\n"
                "8. NEVER stop midway. Your answer MUST have a complete opening, body, and conclusion."
            )
            fallback = (
                "That question is right on track with today's focus. Try applying the techniques "
                "from the lesson — write out 2-3 attempts and compare them to spot the pattern."
            )

        answer = ""
        try:
            answer = await generate_text(
                prompt, settings,
                temperature=0.55, max_tokens=2048, timeout=90,
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
            audio_url = await store_audio_and_url(AUDIO_DIR / filename, filename, settings.audio_base_url)
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

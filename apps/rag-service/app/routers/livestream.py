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
from app.services.llm_service import generate_text, generate_text_stream, extract_json_object
from app.services.image_service import fetch_images_for_queries
from app.services.storage import store_audio_and_url
from app.clients.course_client import (
    save_recording_to_course_service,
    list_recordings_from_course_service,
    get_recording_from_course_service,
)

router = APIRouter(prefix="/api/livestream", tags=["Livestream"])

# ── In-process WebSocket registry (LOCAL sockets only) ────────────────────────
# Only the live WebSocket objects live in-process. All *shared* room state
# (presence + raised-hand queue) lives in Redis so the feature behaves correctly
# across multiple uvicorn workers / replicas, and broadcasting goes through
# Redis Pub/Sub (see _broadcast / _pubsub_listener) so a message published on one
# worker reaches sockets connected to any other worker.
_connections: dict[str, dict[str, WebSocket]] = {}

# Strong references to fire-and-forget background tasks. asyncio keeps only a
# WEAK reference to a task returned by create_task, so a task whose return value
# is discarded can be garbage-collected *before it runs*. That silently dropped
# every Q&A broadcast: `ask_question` spawned `_answer_question` via a bare
# create_task, the task was collected before broadcasting, and so neither the
# asker nor anyone else ever received `question_asked` / `ai_answer`. Keeping the
# task in this set until it finishes prevents the premature GC.
_background_tasks: set[asyncio.Task] = set()


def _spawn(coro) -> asyncio.Task:
    """create_task that won't be garbage-collected mid-flight (see above).

    Also surfaces failures: a bare fire-and-forget task swallows its exception
    (asyncio only logs it on GC, often never), so we log it on completion.
    """
    task = asyncio.create_task(coro)
    _background_tasks.add(task)

    def _done(t: asyncio.Task):
        _background_tasks.discard(t)
        if not t.cancelled():
            exc = t.exception()
            if exc:
                import traceback
                print(f"[Livestream] background task failed: {exc!r}")
                traceback.print_exception(type(exc), exc, exc.__traceback__)

    task.add_done_callback(_done)
    return task


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


# ── Q&A pause: hold the lecture while a learner question is being answered ──────
# While this counter is > 0, `_deliver_lesson` stops sending the next slide so the
# AI's spoken answer never overlaps the next slide's narration. Redis-backed so it
# works across uvicorn workers (the answer task and the lesson loop may run in
# different processes — see _broadcast / _pubsub_listener).

def _qa_active_key(room_id: str) -> str:
    return f"livestream:qa_active:{room_id}"


# Max seconds the lecture will wait on a single Q&A before force-resuming, so a
# crashed/hung answer task can never freeze slide delivery permanently.
QA_PAUSE_MAX_SECONDS = 300


async def _qa_begin(r: aioredis.Redis, room_id: str) -> None:
    """Mark a learner Q&A as in flight. TTL-bounded as a deadlock guard."""
    await r.incr(_qa_active_key(room_id))
    await r.expire(_qa_active_key(room_id), QA_PAUSE_MAX_SECONDS)


async def _qa_end(r: aioredis.Redis, room_id: str) -> None:
    if await r.decr(_qa_active_key(room_id)) <= 0:
        await r.delete(_qa_active_key(room_id))


async def _qa_active(r: aioredis.Redis, room_id: str) -> bool:
    raw = await r.get(_qa_active_key(room_id))
    try:
        return raw is not None and int(raw) > 0
    except (TypeError, ValueError):
        return False


async def _wait_while_qa_active(r: aioredis.Redis, room_id: str) -> None:
    """Block slide delivery while a learner Q&A is being answered, so the AI's
    answer never overlaps the next slide. Bounded by QA_PAUSE_MAX_SECONDS."""
    waited = 0.0
    while waited < QA_PAUSE_MAX_SECONDS and await _qa_active(r, room_id):
        await asyncio.sleep(0.5)
        waited += 0.5


# ── Live quiz checkpoints ──────────────────────────────────────────────────────
# After every ~2 slides the lecture pauses for a Kahoot-style comprehension
# poll: `quiz_start` opens a timed answer window, votes arrive as `quiz_answer`
# WS messages (aggregated in a Redis hash so answers landing on any uvicorn
# worker are counted), then `quiz_result` reveals a per-option tally + the AI's
# spoken explanation. correct_index is withheld until the reveal.

QUIZ_ANSWER_SECONDS = 15    # answering window shown to students
QUIZ_GRACE_SECONDS = 1.5    # network grace after the window closes
QUIZ_RESULT_MIN_SECONDS = 6.0  # minimum hold on the result chart before the next slide


def _quiz_active_key(room_id: str) -> str:
    """JSON {id, deadline, n_options} for the currently open quiz, if any."""
    return f"livestream:quiz_active:{room_id}"


def _quiz_answers_key(room_id: str, quiz_id: str) -> str:
    """Hash user_id → chosen option index for one quiz."""
    return f"livestream:quiz_answers:{room_id}:{quiz_id}"


def _extract_quiz(section: dict) -> dict | None:
    """Validate + normalise the LLM-generated quiz for a section. Returns None
    when missing or malformed — the checkpoint is then simply skipped, so a
    partially bad lesson (or the no-quiz fallback template) still plays fine."""
    quiz = section.get("quiz")
    if not isinstance(quiz, dict):
        return None
    question = str(quiz.get("question", "")).strip()
    options = [str(o).strip() for o in (quiz.get("options") or []) if str(o).strip()][:4]
    explanation = str(quiz.get("explanation", "")).strip()
    try:
        correct = int(quiz.get("correct_index", -1))
    except (TypeError, ValueError):
        return None
    if not question or len(options) < 2 or not (0 <= correct < len(options)):
        return None
    return {
        "question": question,
        "options": options,
        "correct_index": correct,
        "explanation": explanation,
    }


# ── Live choral pronunciation battles ─────────────────────────────────────────
# On a genuinely SPEAKING section the lecture pauses for a synchronized choral
# battle: `battle_start` opens a shared countdown + read-aloud window, every
# learner reads the SAME phrase aloud at the SAME second, scores their own
# attempt locally (Whisper transcript → Levenshtein) and submits one 0-100
# score via `battle_submit` (first-write-wins, HSETNX), then `battle_result`
# reveals a ranked leaderboard. Mirrors the quiz runner so it rides the same
# Redis + Pub/Sub transport across uvicorn workers. Gated HARD (the
# is_speaking_lesson flag AND a per-section phrase AND _extract_phrase) so it
# can NEVER fire on a writing / grammar / roadmap lesson.

BATTLE_SUBMIT_SECONDS = 16       # countdown + read-aloud window shown to learners
# Whisper transcription + the submit round-trip happens AFTER the visible window
# closes, so the grace must cover it. An earlier build proved a small grace
# silently dropped slow submissions, so keep this generous.
BATTLE_GRACE_SECONDS = 9
BATTLE_RESULT_MIN_SECONDS = 7.0  # minimum hold on the podium before the next slide
MAX_BATTLES_PER_LESSON = 2

# A phrase that IS one of these (or is mostly these) is a label about studying,
# not a real utterance to say aloud — reject it.
_BATTLE_META_WORDS = {
    "foundation", "vocabulary", "grammar", "practice", "roadmap", "skill",
    "lesson", "technique", "section", "example", "introduction", "summary",
    "overview", "phase", "step", "objective", "goal",
}
_BATTLE_WORD_RE = re.compile(r"[A-Za-z']+")
_BATTLE_ALLOWED_RE = re.compile(r"^[A-Za-z0-9 '\-.,!?]+$")


def _battle_active_key(room_id: str) -> str:
    """JSON {id, deadline, phrase, ordinal, total} for the open battle, if any."""
    return f"livestream:battle_active:{room_id}"


def _battle_answers_key(room_id: str, battle_id: str) -> str:
    """Hash user_id → JSON {score, name} for one battle (first-write-wins)."""
    return f"livestream:battle_answers:{room_id}:{battle_id}"


def _battle_recording_key(room_id: str) -> str:
    """Transient SET of user_ids currently recording — feeds the crowd ticker."""
    return f"livestream:battle_recording:{room_id}"


def _extract_phrase(section: dict) -> str | None:
    """Deterministic backstop of the speaking-battle gate. Returns a clean,
    sayable English phrase, or None (battle silently skipped) when the generated
    `practice_phrase` is missing, junk, the wrong language, or a meta-label —
    even if the LLM ignores the prompt rules. Never raises."""
    phrase = str(section.get("practice_phrase", "")).strip()
    if not phrase:
        return None
    # Latin script + simple punctuation only (blocks stray Vietnamese / CJK).
    if not _BATTLE_ALLOWED_RE.match(phrase):
        return None
    words = _BATTLE_WORD_RE.findall(phrase)
    if not (4 <= len(words) <= 12):
        return None
    # Reject meta-label phrases ("Foundation skill", "Grammar practice", …).
    meta = sum(1 for w in words if w.lower() in _BATTLE_META_WORDS)
    if meta and meta * 2 >= len(words):
        return None
    # Must look like a real utterance: a space, a vowel, not ALL-CAPS shouting.
    if " " not in phrase:
        return None
    if not any(v in phrase.lower() for v in "aeiou"):
        return None
    if phrase == phrase.upper() and any(c.isalpha() for c in phrase):
        return None
    return phrase


# ── Teacher perception signals ─────────────────────────────────────────────────
# Cheap "the AI sees the room" loop: reactions and incoming questions are
# counted in a Redis hash; between slides _maybe_teacher_aside reads (and
# clears) the hash, folds in the latest quiz outcome, and — only when the
# signals cross a threshold — makes one short LLM call to produce a single
# spoken sentence reacting to the class. Below the threshold nothing is
# generated, so a quiet room costs zero extra LLM/TTS calls.

POSITIVE_REACTIONS = {"👍", "❤️", "👏", "🎉", "🔥", "😂"}
CONFUSED_REACTIONS = {"🤔", "😮"}
ASIDE_MAX_HOLD_SECONDS = 25.0


def _signals_key(room_id: str) -> str:
    return f"livestream:signals:{room_id}"


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
    """Replace known acronyms with TTS-friendly phonetic spellings and strip markdown."""
    text = re.sub(r'[*#>`~_]', '', text)
    text = re.sub(r'^\s*[-+]\s+', '', text, flags=re.MULTILINE)
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


# Q&A entries live in their own Redis list rather than inside the room JSON:
# `_answer_question` (append qa) and `_deliver_lesson` (append transcript) both
# read-modify-write the room blob concurrently, so storing qa there could lose
# entries to the classic lost-update race. RPUSH is atomic per entry.

def _qa_key(room_id: str) -> str:
    return f"livestream:qa:{room_id}"


async def _append_qa(r: aioredis.Redis, room_id: str, entry: dict) -> None:
    await r.rpush(_qa_key(room_id), json.dumps(entry))
    await r.expire(_qa_key(room_id), ROOM_TTL)


async def _load_qa(r: aioredis.Redis, room_id: str) -> list[dict]:
    out: list[dict] = []
    for raw in await r.lrange(_qa_key(room_id), 0, -1):
        try:
            out.append(json.loads(raw))
        except json.JSONDecodeError:
            continue
    return out


async def _scan_keys(r: aioredis.Redis, pattern: str) -> list[str]:
    """Non-blocking key enumeration. KEYS is O(N) and blocks the Redis event
    loop on large keyspaces; SCAN walks the keyspace in small batches instead."""
    keys: list[str] = []
    async for k in r.scan_iter(match=pattern, count=200):
        keys.append(k)
    return keys


async def _list_rooms(r: aioredis.Redis) -> list[dict]:
    keys = await _scan_keys(r, "livestream:room:*")
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
    keys = await _scan_keys(r, "livestream:recording:*")
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
        "host_id": room.get("host_id"),
        "host_name": room["host_name"],
        "language": room.get("language", "en"),
        "completed_at": datetime.utcnow().isoformat(),
        "sections": sections,
        "qa": await _load_qa(r, room["id"]),
    }
    await r.set(f"livestream:recording:{room['id']}", json.dumps(recording), ex=RECORDING_TTL)
    # Durable copy in Postgres (course-service) — queryable and survives the
    # 7-day Redis TTL. Fire-and-forget: the client swallows + logs its own errors
    # so a failed persist can never break lesson completion.
    _spawn(save_recording_to_course_service(recording))


def _protected_filenames(recording: dict) -> set[str]:
    """Collect all audio filenames referenced by a recording."""
    files: set[str] = set()
    for s in recording.get("sections", []):
        urls = [s.get("audio_url", "")]
        quiz = s.get("quiz") or {}
        urls += [quiz.get("question_audio_url", ""), quiz.get("explanation_audio_url", "")]
        battle = s.get("battle") or {}
        urls += [battle.get("intro_audio_url", ""), battle.get("reveal_audio_url", "")]
        for url in urls:
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

# Keepalive / health-check options so managed Redis (Upstash) doesn't silently
# drop idle pub/sub connections. Without periodic PINGs the blocking SUBSCRIBE
# read eventually raises "Timeout reading from ..." and the listener crash-loops.
_REDIS_KWARGS = dict(
    decode_responses=True,
    health_check_interval=30,
    socket_keepalive=True,
    socket_connect_timeout=10,
)

# Unique id for THIS process. Published with every broadcast so the Pub/Sub
# listener on the same process can skip messages it already delivered locally
# (see _broadcast / _pubsub_listener) — prevents double delivery.
_PROCESS_ID = uuid.uuid4().hex


def _channel(room_id: str) -> str:
    return f"livestream:channel:{room_id}"


async def _get_pub_redis() -> aioredis.Redis:
    global _pub_redis
    if _pub_redis is None:
        from app.config import get_settings
        _pub_redis = aioredis.from_url(get_settings().redis_url, **_REDIS_KWARGS)
    return _pub_redis


async def _broadcast(room_id: str, message: dict):
    """Publish a message to every participant of a room, across all workers.

    Delivery is in two parts:
      1. Deliver immediately to sockets on THIS process. This guarantees the
         message reaches local participants even if Redis Pub/Sub is unavailable
         or its listener is not (yet) subscribed — which is the common
         single-process dev case, where relying on Pub/Sub alone silently dropped
         every broadcast (host never saw participants join).
      2. Fan out to OTHER processes via Pub/Sub, tagged with this process's id so
         our own listener skips it (already delivered in step 1) — no double send.
    """
    await _local_deliver(room_id, message)
    try:
        r = await _get_pub_redis()
        await r.publish(_channel(room_id), json.dumps({
            "room_id": room_id, "message": message, "origin": _PROCESS_ID,
        }))
    except Exception as e:
        # Other processes won't get it, but local sockets already did (step 1).
        print(f"[Livestream] cross-process publish failed (local delivery done): {e}")


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
            r = aioredis.from_url(settings.redis_url, **_REDIS_KWARGS)
            pubsub = r.pubsub()
            await pubsub.psubscribe("livestream:channel:*")
            print("[Livestream] Pub/Sub listener subscribed")
            # Bounded reads instead of a never-returning listen(): get_message
            # returns None after `timeout` of silence (no crash), and on each idle
            # tick we PING so Upstash doesn't close the connection as idle. An
            # unbounded listen() parks in a blocking read where health-check PINGs
            # never fire — which is exactly why the connection kept timing out.
            while True:
                msg = await pubsub.get_message(ignore_subscribe_messages=True, timeout=15.0)
                if msg is None:
                    # PING on the SUBSCRIBED connection (not r — that uses a
                    # different pooled connection). Keeps Upstash from idle-closing
                    # the pub/sub socket; raises if it already died → reconnect.
                    await pubsub.ping()
                    continue
                if msg.get("type") != "pmessage":
                    continue
                try:
                    data = json.loads(msg["data"])
                    # Skip messages we published ourselves — _broadcast already
                    # delivered them to this process's local sockets.
                    if data.get("origin") == _PROCESS_ID:
                        continue
                    await _local_deliver(data["room_id"], data["message"])
                except Exception as e:
                    print(f"[Livestream] deliver error: {e}")
        except Exception as e:
            print(f"[Livestream] Pub/Sub listener crashed, restarting in 5s: {e}")
            await asyncio.sleep(5)


def start_pubsub_listener():
    """Kick off the per-process Pub/Sub listener (called from app startup)."""
    _spawn(_pubsub_listener())


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

_LESSON_PROMPT_EN = """You are a master English teacher delivering a live lesson.

═══ TEACHING DIRECTIVE — this is the ONE thing you MUST answer ═══
{lesson_focus}
════════════════════════════════════════════════════════════════

Lesson label (display only, do NOT explain this generically): "{topic}"
Audience: {level} English learners.

Step 1 — classify the directive into one type:
• TIMELINE/ROADMAP  (e.g. "how to reach 6.0 in 12 months") → 5 sequential phases with weeks/milestones
• TECHNIQUE/HOW-TO  (e.g. "how to develop ideas in Speaking Part 2") → problem framing → technique 1 → technique 2 → worked example → mistakes & fix
• COMPARISON        (e.g. "PTE vs IELTS") → criterion-by-criterion comparison + recommendation
• TROUBLESHOOTING   (e.g. "why is my Writing stuck at 5.5?") → diagnosis → root causes → fixes → rescue plan
• CONCEPT/EXPLAINER (e.g. "what is a band descriptor?") → core idea → mechanics → why it matters → real example → daily-practice impact
Default if unsure: TECHNIQUE.

Also emit a top-level boolean "is_speaking_lesson": set it true ONLY if the directive is about PRODUCING spoken English (pronunciation, a Speaking-part technique, conversation, fluency or intonation drills). For IELTS/study roadmaps, grammar, writing, reading, listening, comparisons, troubleshooting and concept explainers → false.

Step 2 — write 5 sections that ADVANCE the directive step by step.

RULES (violating any = invalid output):
1. Every sentence in every section must directly serve the directive. Generic background about the lesson label is FORBIDDEN.
2. "title": 5-12 words naming the specific step/technique/phase — must NOT be a generic label name.
3. "content": 80-130 words, warm & conversational, information-dense. NO platitudes. FORBIDDEN first words: "Welcome", "Today", "In this section", "Let's explore", "Many students".
4. "key_points": EXACTLY 4 bullets, each 10-18 words, each a concrete actionable step (e.g. "Spend 20 min daily on Cambridge Listening Test 1 audio", NOT "practise listening").
5. "keywords": 0-3 English terms a learner should actually LEARN from this section — real content vocabulary (words, phrases, collocations) with meanings. FORBIDDEN: meta-words about studying itself ("foundation", "vocabulary", "grammar", "practice", "roadmap", "skill"). If the section has no genuine vocabulary worth learning (e.g. a study-plan phase or comparison), return an empty list []. An empty list is valid and often correct.
6. "example": 1 natural English sentence (12-20 words) showing the section's idea in use — include ONLY when the section teaches actual language content (vocabulary, grammar, expressions, techniques applied in English). For planning/roadmap/comparison sections, leave it empty ("").
7. "practice_phrase": a SPEAKING exercise for a synchronized choral read-aloud. ONLY when is_speaking_lesson is true AND this section teaches a concrete spoken utterance, give ONE real, natural, SAYABLE English sentence of 4-12 words a learner would actually speak aloud (e.g. "I'd like to make a reservation for two, please"). It must be a genuine utterance, NOT a description of the lesson. FORBIDDEN: meta-words (foundation, vocabulary, grammar, practice, roadmap, skill, lesson, technique), fragments, or word lists. On every other section, and on ALL non-speaking lessons, set it to "".
8. "image_query": 2-4 concrete English visual keywords for this section's content.
9. "quiz": a live multiple-choice comprehension check on THIS section (shown to the whole class as a timed poll). "question": ONE sentence testing UNDERSTANDING or APPLICATION of this section's content — never word-for-word recall of the text. "options": EXACTLY 4 short plausible answers (each under 12 words), only ONE correct, wrong options must reflect realistic misconceptions. "correct_index": integer 0-3. "explanation": 1-2 sentences why the correct answer is right.

═══ FINAL REMINDER — re-read before generating ═══
Directive: {lesson_focus}
Every section MUST advance THIS directive, not explain "{topic}" in general.
═════════════════════════════════════════════════

Respond ONLY with valid JSON (no prose before or after):
{{"is_speaking_lesson": false, "sections": [{{"title": "...", "content": "...", "key_points": ["...","...","...","..."], "keywords": [{{"term":"...","meaning":"..."}},{{"term":"...","meaning":"..."}},{{"term":"...","meaning":"..."}}], "example": "...", "practice_phrase": "...", "image_query": "...", "quiz": {{"question":"...","options":["...","...","...","..."],"correct_index":0,"explanation":"..."}}}}, ...5 sections total]}}

All fields in {level}-appropriate English."""

_LESSON_PROMPT_VI = """Bạn là giáo viên tiếng Anh giỏi đang dạy livestream.

═══ NỘI DUNG CẦN DẠY — đây là điều DUY NHẤT bạn phải trả lời ═══
{lesson_focus}
════════════════════════════════════════════════════════════════

Nhãn bài (chỉ để hiển thị, KHÔNG được giải thích chung chung về nhãn này): "{topic}"
Đối tượng: học viên trình độ {level}.

Bước 1 — xác định loại câu hỏi của directive:
• LỘ TRÌNH/TIMELINE  (vd "lộ trình 12 tháng từ 0 đến 6.0") → 5 giai đoạn tuần tự với mốc thời gian & milestone cụ thể
• KỸ THUẬT/HOW-TO   (vd "làm sao phát triển idea trong Speaking Part 2") → đặt vấn đề → kỹ thuật 1 → kỹ thuật 2 → ví dụ thực hành → lỗi & action plan
• SO SÁNH           (vd "PTE vs IELTS nên thi cái nào?") → so sánh từng tiêu chí + khuyến nghị
• GỠ RỐI            (vd "tại sao Writing tôi mãi 5.5?") → chẩn đoán → nguyên nhân → cách sửa → kế hoạch
• GIẢI THÍCH KHÁI NIỆM (vd "band descriptor là gì?") → ý cốt lõi → cơ chế → tại sao quan trọng → ví dụ → ảnh hưởng hằng ngày
Mặc định nếu không chắc: KỸ THUẬT.

Đồng thời xuất một boolean cấp cao "is_speaking_lesson": đặt true CHỈ KHI directive nói về việc TẠO RA tiếng Anh NÓI (phát âm, kỹ thuật Speaking, hội thoại, luyện trôi chảy/ngữ điệu). Với lộ trình/kế hoạch học, ngữ pháp, viết, đọc, nghe, so sánh, gỡ rối và giải thích khái niệm → false.

Bước 2 — viết 5 phần ĐẨY directive tiến lên từng bước.

LUẬT (vi phạm bất kỳ luật nào = đầu ra không hợp lệ):
1. Mọi câu trong mọi phần phải trực tiếp phục vụ directive. Filler chung về nhãn bài BỊ CẤM.
2. "title": 5-12 từ nêu rõ bước/kỹ thuật/giai đoạn cụ thể — KHÔNG được là tên nhãn bài chung chung.
3. "content": 80-130 từ TIẾNG VIỆT, ấm áp & hội thoại, đặc thông tin. CẤM mở đầu bằng: "Chào mừng", "Bài học hôm nay", "Trong phần này", "Hãy cùng khám phá", "Nhiều bạn".
4. "key_points": ĐÚNG 4 bullet, mỗi cái 10-18 từ TIẾNG VIỆT, actionable cụ thể (vd "Luyện 20 phút Cambridge Listening test 1 mỗi ngày", KHÔNG "luyện nghe thường xuyên").
5. "keywords": 0-3 từ/cụm tiếng Anh học viên thực sự cần HỌC từ phần này — từ vựng nội dung thật (từ, cụm từ, collocation) kèm nghĩa tiếng Việt. CẤM meta-words nói về việc học ("foundation", "vocabulary", "grammar", "practice", "roadmap", "skill"). Nếu phần này không có từ vựng đáng học (vd một giai đoạn lộ trình, phần so sánh), trả về mảng rỗng []. Mảng rỗng là hợp lệ và thường là đúng.
6. "example": 1 câu tiếng Anh tự nhiên 12-20 từ minh hoạ ý của phần — CHỈ chèn khi phần này dạy nội dung ngôn ngữ thật (từ vựng, ngữ pháp, mẫu câu, kỹ thuật dùng tiếng Anh). Với phần lộ trình/kế hoạch/so sánh, để trống ("").
7. "practice_phrase": bài tập NÓI để cả lớp đọc to đồng thanh. CHỈ khi is_speaking_lesson = true VÀ phần này dạy một câu nói cụ thể, hãy cho MỘT câu tiếng Anh tự nhiên, NÓI ĐƯỢC, dài 4-12 từ mà người học sẽ thật sự nói ra (vd "I'd like to make a reservation for two, please"). Phải là câu nói thật, KHÔNG phải mô tả bài học. CẤM: meta-words (foundation, vocabulary, grammar, practice, roadmap, skill, lesson, technique), mảnh vụn, hay danh sách từ. Với mọi phần khác, và với MỌI bài không phải speaking, đặt "".
8. "image_query": 2-4 từ tiếng Anh trực quan khớp nội dung phần đó.
9. "quiz": câu trắc nghiệm kiểm tra hiểu bài của phần này (hiện cho CẢ LỚP bình chọn trực tiếp có đếm giờ). "question": 1 câu kiểm tra mức độ HIỂU/ÁP DỤNG nội dung phần — không hỏi thuộc lòng nguyên văn. "options": ĐÚNG 4 đáp án ngắn (mỗi cái dưới 12 từ), chỉ 1 đáp án đúng, các đáp án sai phải là hiểu lầm thường gặp. "correct_index": số nguyên 0-3. "explanation": 1-2 câu giải thích vì sao đáp án đúng.

═══ NHẮC LẠI TRƯỚC KHI SINH — đọc lại trước khi viết ═══
Directive: {lesson_focus}
Mỗi phần PHẢI đẩy directive NÀY tiến lên, không giải thích "{topic}" một cách chung chung.
═════════════════════════════════════════════════════════════

Chỉ trả về JSON hợp lệ (không có prose trước hoặc sau):
{{"is_speaking_lesson": false, "sections": [{{"title": "...", "content": "...", "key_points": ["...","...","...","..."], "keywords": [{{"term":"...","meaning":"..."}},{{"term":"...","meaning":"..."}},{{"term":"...","meaning":"..."}}], "example": "...", "practice_phrase": "...", "image_query": "...", "quiz": {{"question":"...","options":["...","...","...","..."],"correct_index":0,"explanation":"..."}}}}, ...5 phần]}}

NGÔN NGỮ: title / content / key_points / keywords.meaning / quiz.question / quiz.options / quiz.explanation → TIẾNG VIỆT (giữ thuật ngữ tiếng Anh khi cần); keywords.term / example / image_query / practice_phrase → TIẾNG ANH."""


def _fallback_sections(topic: str, level: str, language: str) -> list[dict]:
    if language == "vi":
        return [
            {"title": "Giới thiệu bài học", "image_query": "classroom welcome teacher",
             "content": f"Chào mừng bạn đến với bài học về chủ đề {topic}. Đây là chủ đề rất hữu ích cho người học tiếng Anh trình độ {level}. Chúng ta sẽ cùng khám phá từng bước một.",
             "key_points": [f"Chủ đề: {topic}", f"Phù hợp trình độ {level}", "Học theo từng bước rõ ràng"],
             "keywords": [{"term": "lesson", "meaning": "bài học"}, {"term": "step by step", "meaning": "từng bước"}],
             "example": f"Today's lesson is about {topic}."},
            {"title": "Từ vựng quan trọng", "image_query": "english vocabulary dictionary book",
             "content": f"Trước tiên, hãy cùng tìm hiểu những từ vựng chính liên quan đến {topic}. Nắm vững từ vựng sẽ giúp bạn hiểu và sử dụng chủ đề này tự tin hơn.",
             "key_points": ["Học từ vựng cốt lõi của chủ đề", "Hiểu nghĩa và cách dùng", "Áp dụng vào giao tiếp thực tế"],
             "keywords": [{"term": "vocabulary", "meaning": "từ vựng"}, {"term": "confident", "meaning": "tự tin"}],
             "example": f"I want to improve my {topic} vocabulary."},
            {"title": "Khái niệm cốt lõi", "image_query": "concept lightbulb idea brainstorm",
             "content": f"Nội dung chính của {topic} có thể chia thành vài ý đơn giản. Khi hiểu từng ý, bạn sẽ thấy bức tranh tổng thể rõ ràng hơn nhiều.",
             "key_points": ["Chia nhỏ thành ý đơn giản", "Hiểu từng phần một", "Tổng hợp lại bức tranh lớn"],
             "keywords": [{"term": "concept", "meaning": "khái niệm"}, {"term": "overall", "meaning": "tổng thể"}],
             "example": "Understanding the basics makes everything clearer."},
            {"title": "Ví dụ thực tế", "image_query": "people conversation real life english",
             "content": f"Hãy xem {topic} xuất hiện như thế nào trong tiếng Anh hàng ngày. Các ví dụ này sẽ cho bạn thấy cách dùng những gì đã học hôm nay.",
             "key_points": ["Quan sát ví dụ thực tế", "Học cách dùng trong ngữ cảnh", "Luyện tập hằng ngày"],
             "keywords": [{"term": "example", "meaning": "ví dụ"}, {"term": "practice", "meaning": "luyện tập"}],
             "example": f"Practice {topic} every day for the best results."},
            {"title": "Tóm tắt & Luyện tập", "image_query": "student success notebook study",
             "content": f"Bạn đã hoàn thành bài học về {topic}! Hãy ôn lại từ vựng, luyện tập các ví dụ và bạn sẽ tiến bộ rất nhanh.",
             "key_points": ["Ôn lại từ vựng đã học", "Luyện tập các ví dụ", "Kiên trì để tiến bộ"],
             "keywords": [{"term": "review", "meaning": "ôn tập"}, {"term": "progress", "meaning": "tiến bộ"}],
             "example": "Review and practice are the keys to progress."},
        ]
    return [
        {"title": "Welcome & Introduction", "image_query": "classroom welcome teacher",
         "content": f"Welcome to today's lesson about {topic}. This topic is very useful for {level} English learners. Let's explore it step by step together.",
         "key_points": [f"Today's topic: {topic}", f"Designed for {level} learners", "Step-by-step exploration"],
         "keywords": [{"term": "lesson", "meaning": "a unit of teaching"}, {"term": "explore", "meaning": "investigate or study"}],
         "example": f"Today we will explore {topic} together."},
        {"title": "Key Vocabulary", "image_query": "english vocabulary dictionary book",
         "content": f"First, let's look at the most important words related to {topic}. Learning these words will help you understand and talk about this topic with confidence.",
         "key_points": ["Learn the core vocabulary", "Understand meanings and usage", "Speak with confidence"],
         "keywords": [{"term": "vocabulary", "meaning": "set of words known"}, {"term": "confident", "meaning": "sure of yourself"}],
         "example": f"Building vocabulary is essential for mastering {topic}."},
        {"title": "Core Concepts", "image_query": "concept lightbulb idea brainstorm",
         "content": f"The main ideas behind {topic} can be broken down into a few simple parts. Once you understand each part, the whole picture becomes much clearer.",
         "key_points": ["Break down into simple parts", "Understand each piece", "See the whole picture"],
         "keywords": [{"term": "concept", "meaning": "main idea"}, {"term": "overall", "meaning": "in total"}],
         "example": "Understanding the basics makes complex ideas clearer."},
        {"title": "Real-Life Examples", "image_query": "people conversation real life english",
         "content": f"Let's see how {topic} appears in everyday English. These examples will show you when and how to use what you have learned today.",
         "key_points": ["Real-world examples", "Learn usage in context", "Daily practice tips"],
         "keywords": [{"term": "example", "meaning": "a sample case"}, {"term": "context", "meaning": "the situation around"}],
         "example": f"You can use {topic} in many everyday situations."},
        {"title": "Summary & Practice Tips", "image_query": "student success notebook study",
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
    # Bump the version prefix whenever the lesson prompt changes — old cached
    # lessons were generated under the previous rules and must not be served.
    # v5: sections carry a "quiz" comprehension checkpoint. v6: practice_phrase
    # removed entirely (the speaking card/battle was cut from the live room).
    # v7: keywords/example are optional — only for real language content, no
    # meta-word filler on roadmap/comparison sections. v8: re-added a GATED
    # practice_phrase + a top-level is_speaking_lesson flag (choral battles).
    cache_key = "livestream:lesson:v8:" + hashlib.sha1(
        f"{language}|{level}|{topic.strip()}|{lesson_prompt.strip()}".encode("utf-8")
    ).hexdigest()
    print(f"[Lesson] Generating lesson: topic={topic!r} level={level} lang={language} prompt={lesson_prompt!r}")
    try:
        cached = await r.get(cache_key)
        if cached:
            secs = json.loads(cached)
            if secs:
                print(f"[Lesson] Cache HIT ({len(secs)} sections) — skipping LLM call")
                return secs, False
        print("[Lesson] Cache MISS — calling LLM")
    except Exception:
        pass

    prompt_tpl = _LESSON_PROMPT_VI if language == "vi" else _LESSON_PROMPT_EN
    if lesson_prompt.strip():
        lesson_focus = lesson_prompt.strip()
    elif language == "vi":
        lesson_focus = (
            f"Dạy những gì một học viên trình độ {level} CẦN BIẾT NHẤT về \"{topic}\": "
            f"kỹ thuật cụ thể, ví dụ thực tế, lỗi phổ biến cần tránh, và bài tập có thể làm ngay hôm nay."
        )
    else:
        lesson_focus = (
            f"Teach what a {level} learner MOST NEEDS to know about \"{topic}\": "
            f"concrete techniques, real examples, common mistakes to avoid, and exercises they can do today."
        )
    prompt = prompt_tpl.format(topic=topic, lesson_focus=lesson_focus, level=level)
    usage: dict = {}
    try:
        # max_tokens was 6144, but a full 5-section Vietnamese lesson (content +
        # key_points + keywords + examples) routinely exceeds that, so Gemini's
        # JSON got truncated mid-object → unparseable → silent fallback. Gemini
        # 2.5 Flash supports up to 65k output tokens; give it generous headroom.
        raw = await generate_text(
            prompt, settings,
            temperature=0.45, max_tokens=16384, timeout=120,
            json_mode=True,
            usage=usage,
        )
        parsed = extract_json_object(raw)
        if parsed:
            sections = parsed.get("sections", [])
            if sections:
                # Stamp the lesson-level speaking flag onto each section so the
                # cached object carries it and _deliver_lesson can gate battles
                # on a per-section basis. A non-speaking lesson → flag stays off,
                # so a battle can never fire even if a stray phrase slips through.
                is_speaking = bool(parsed.get("is_speaking_lesson", False))
                for s in sections:
                    if isinstance(s, dict):
                        s["_is_speaking_lesson"] = is_speaking
                print(
                    f"[Lesson] ✅ CONTENT GENERATED BY: {usage.get('provider')}"
                    f" / {usage.get('model')} — {len(sections)} sections, "
                    f"speaking={is_speaking}, caching for 7 days"
                )
                try:
                    await r.set(cache_key, json.dumps(sections), ex=7 * 86400)
                except Exception:
                    pass
                return sections, False
        # Parse failed — dump what the LLM actually returned so the dev can see
        # WHY (truncation shows up as JSON that doesn't end in '}'; markdown
        # fences / stray prose show up in the head/tail).
        looks_truncated = bool(raw) and not raw.rstrip().endswith("}")
        print(
            f"[Lesson] ⚠️ CONTENT GENERATED BY: FALLBACK TEMPLATE (no AI) — "
            f"{usage.get('provider')}/{usage.get('model')} returned unparseable JSON "
            f"(len={len(raw)}, likely_truncated={looks_truncated})"
        )
        if raw:
            print(f"[Lesson]   raw head: {raw[:200]!r}")
            print(f"[Lesson]   raw tail: {raw[-200:]!r}")
    except Exception as e:
        print(f"[Lesson] ⚠️ CONTENT GENERATED BY: FALLBACK TEMPLATE (no AI) — LLM call failed: {e}")
    return _fallback_sections(topic, level, language), True


# ── Warm class opening / closing ────────────────────────────────────────────────
# The lesson sections are deliberately dense and FORBIDDEN from generic openers
# ("Welcome", "Today", …) so they never waste words. That made the AI dive
# straight into the material, which feels abrupt — a real teacher greets the
# class first ("Hi everyone, today we're going to…"). So before the first slide
# we play a short spoken greeting, and after the last slide a short sign-off into
# the Q&A. These are SPOKEN-ONLY: they're folded into the narration audio, not
# shown as slide text, so the dense slides stay clean.

_INTRO_PROMPT_EN = """You are a warm, charismatic English teacher about to go LIVE to your class.
Write ONLY the words you SAY OUT LOUD in your first ~30 seconds to open the lesson — natural spoken language, no stage directions, no markdown, no bullet lists, no headings.

Do all of this, in a natural flow:
• Greet the class warmly and personally (e.g. "Hi everyone! So happy to see you all here today.").
• In one or two sentences, say what today's lesson will help them do — make them WANT it.
• Briefly hint that you'll walk through it together step by step.
• Invite them to react with emojis and to drop questions in the chat anytime — you'll be watching.
• End on an energetic cue to begin (e.g. "Ready? Let's dive in!").

Tone: friendly, energetic, encouraging — like a favourite teacher on camera, not a textbook. 60-90 words. Address them as "you"/"everyone". Audience: {level} English learners.

Today's lesson focus: {lesson_focus}
The parts you'll cover today: {titles}

Output ONLY the spoken greeting, nothing else."""

_INTRO_PROMPT_VI = """Bạn là một cô/thầy giáo tiếng Anh ấm áp, cuốn hút, chuẩn bị LÊN SÓNG livestream cho lớp học.
Chỉ viết đúng những lời bạn NÓI RA trong khoảng 30 giây đầu để mở bài — ngôn ngữ nói tự nhiên, KHÔNG chỉ dẫn sân khấu, KHÔNG markdown, KHÔNG gạch đầu dòng, KHÔNG tiêu đề.

Làm tất cả những điều sau, một cách mạch lạc tự nhiên:
• Chào cả lớp thật ấm áp và thân thiện (vd "Chào cả lớp! Rất vui được gặp lại các bạn hôm nay nha.").
• Một hai câu nói rõ buổi học hôm nay sẽ giúp các bạn làm được gì — khiến các bạn MUỐN học.
• Gợi ý rằng cô/thầy sẽ cùng các bạn đi qua từng bước một.
• Mời các bạn thả tim, thả emoji và đặt câu hỏi trong khung chat bất cứ lúc nào — cô/thầy luôn để ý.
• Kết bằng một câu hô hào bắt đầu đầy năng lượng (vd "Sẵn sàng chưa? Mình bắt đầu thôi nào!").

Giọng điệu: thân thiện, năng lượng, khích lệ — như một cô giáo được yêu thích đang lên hình, không phải sách giáo khoa. 60-90 từ tiếng Việt. Xưng "cô/thầy" và gọi học viên là "các bạn". Đối tượng: học viên trình độ {level}.

Nội dung buổi học hôm nay: {lesson_focus}
Các phần sẽ học hôm nay: {titles}

Chỉ xuất ra lời chào nói, không gì khác."""


def _fallback_intro(lesson_focus: str, titles: list[str], language: str) -> str:
    n = len(titles) or 5
    if language == "vi":
        return (
            f"Chào cả lớp! Rất vui được gặp các bạn trong buổi học hôm nay. "
            f"Hôm nay cô và các bạn sẽ cùng nhau tìm hiểu về {lesson_focus} "
            f"qua {n} phần, từng bước một thật dễ hiểu. "
            f"Trong lúc học, các bạn cứ thoải mái thả tim, thả emoji và đặt câu hỏi bất cứ lúc nào nhé — "
            f"cô luôn để ý đến cả lớp. Sẵn sàng chưa nào? Mình bắt đầu thôi!"
        )
    return (
        f"Hi everyone! I'm so happy to see you all here today. "
        f"In this lesson we're going to explore {lesson_focus} together, "
        f"step by step across {n} parts. "
        f"As we go, feel free to react with emojis and drop your questions in the chat anytime — "
        f"I'll be watching the room. Ready? Let's dive in!"
    )


def _closing_text(language: str) -> str:
    """Spoken sign-off folded onto the last slide, leading into the Q&A window."""
    if language == "vi":
        return (
            "Và đó là toàn bộ nội dung chính của buổi hôm nay! "
            "Các bạn đã làm rất tốt. Giờ là phần cô thích nhất — hỏi đáp. "
            "Có bất kỳ thắc mắc nào, các bạn cứ giơ tay hoặc gõ vào khung chat nhé, cô sẽ giải đáp ngay!"
        )
    return (
        "And that wraps up the main part of today's lesson! "
        "You've all done a wonderful job. Now for my favourite part — questions. "
        "If anything's on your mind, raise your hand or type it in the chat, and I'll answer right away!"
    )


async def _generate_intro(
    r: aioredis.Redis, lesson_focus: str, titles: list[str], level: str,
    language: str, settings,
) -> str:
    """Short, warm spoken greeting to open the class. LLM-generated and cached;
    falls back to a friendly template so the room always opens warmly."""
    cache_key = "livestream:intro:v1:" + hashlib.sha1(
        f"{language}|{level}|{lesson_focus.strip()}|{'|'.join(titles)}".encode("utf-8")
    ).hexdigest()
    try:
        cached = await r.get(cache_key)
        if cached:
            return cached
    except Exception:
        pass

    title_list = "; ".join(t for t in titles if t) or lesson_focus
    tpl = _INTRO_PROMPT_VI if language == "vi" else _INTRO_PROMPT_EN
    prompt = tpl.format(level=level, lesson_focus=lesson_focus, titles=title_list)
    try:
        raw = await generate_text(
            prompt, settings,
            temperature=0.7, max_tokens=400, timeout=30,
        )
        intro = re.sub(r'[*#>`~_]', '', (raw or "")).strip()
        # Guard against the model returning junk / JSON / something too short.
        if intro and 20 <= len(intro) <= 1200 and not intro.lstrip().startswith("{"):
            try:
                await r.set(cache_key, intro, ex=7 * 86400)
            except Exception:
                pass
            return intro
    except Exception as e:
        print(f"[Livestream] Intro generation failed, using fallback: {e}")
    return _fallback_intro(lesson_focus, titles, language)


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
            "qa": await _load_qa(r, room_id),
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
        out = [
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
    finally:
        await r.aclose()

    # Merge in the durable Postgres archive (course-service) so replays older
    # than the 7-day Redis TTL still show up. Redis wins on conflicts — it's
    # the fresher copy while both exist.
    seen = {rec["room_id"] for rec in out}
    for arch in await list_recordings_from_course_service():
        if arch["room_id"] in seen:
            continue
        arch["level_label"] = arch.get("level_label") or LEVEL_LABELS.get(
            arch.get("level", ""), arch.get("level", "")
        )
        out.append(arch)
    out.sort(key=lambda x: x.get("completed_at") or "", reverse=True)
    return {"recordings": out}


@router.get("/recordings/{room_id}")
async def get_recording(room_id: str):
    from app.config import get_settings
    settings = get_settings()
    r = await _get_redis(settings)
    try:
        rec = await _load_recording(r, room_id)
    finally:
        await r.aclose()
    if not rec:
        # Redis copy expired (7-day TTL) — fall back to the Postgres archive.
        rec = await get_recording_from_course_service(room_id)
        if rec:
            rec["level_label"] = rec.get("level_label") or LEVEL_LABELS.get(
                rec.get("level", ""), rec.get("level", "")
            )
    if not rec:
        raise HTTPException(404, "Recording not found")
    return rec


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

    cache_key = f"livestream:translate:v2:{body.target}:{word.lower()}"
    r = await _get_redis(settings)
    try:
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)

        if body.target == "vi":
            prompt = (
                f'You are a Vietnamese–English dictionary assistant.\n'
                f'Translate the English word or phrase "{word}" into Vietnamese.\n'
                f'\n'
                f'Return ONLY a JSON object with exactly these fields:\n'
                f'  "meaning"       — the Vietnamese translation (viết bằng tiếng Việt, NOT English)\n'
                f'  "pronunciation" — IPA phonetic of the English word, e.g. /wɜːrd/  (empty string if unsure)\n'
                f'  "example"       — one short English example sentence using "{word}"\n'
                f'\n'
                f'Example output for "beautiful":\n'
                f'{{"meaning": "đẹp, xinh đẹp", "pronunciation": "ˈbjuːtɪfəl", "example": "She has a beautiful smile."}}\n'
                f'\n'
                f'Now translate "{word}". Output ONLY the JSON object, no extra text.'
            )
        else:
            prompt = (
                f'Define the English word or phrase "{word}" concisely.\n'
                f'\n'
                f'Return ONLY a JSON object with exactly these fields:\n'
                f'  "meaning"       — a concise English definition (1 short sentence)\n'
                f'  "pronunciation" — IPA phonetic, e.g. /wɜːrd/  (empty string if unsure)\n'
                f'  "example"       — one short English example sentence using "{word}"\n'
                f'\n'
                f'Output ONLY the JSON object, no extra text.'
            )

        result = {"word": word, "meaning": "", "pronunciation": "", "example": ""}
        try:
            raw = await generate_text(
                prompt, settings,
                temperature=0.2, max_tokens=160, timeout=15,
                json_mode=True,
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

        # Restore an in-flight quiz for a client (re)joining mid-poll — without
        # this, a reconnect during the answer window left the user staring at a
        # blank stage while everyone else voted.
        try:
            raw_q = await r.get(_quiz_active_key(room_id))
            if raw_q:
                q = json.loads(raw_q)
                q_remaining = float(q.get("deadline", 0)) - QUIZ_GRACE_SECONDS - time.time()
                if q_remaining > 1 and q.get("question"):
                    await websocket.send_json({
                        "type": "quiz_start",
                        "quiz_id": q["id"],
                        "ordinal": q.get("ordinal", 1),
                        "total": q.get("total", 1),
                        "question": q["question"],
                        "options": q.get("options", []),
                        "duration_seconds": int(q_remaining),
                        "audio_url": "",
                    })
        except Exception as e:
            print(f"[Livestream] quiz restore failed: {e}")

        # Restore an in-flight choral battle for a (re)joining client the same
        # way — so a reconnect mid-window drops them straight back into the
        # chorus instead of a blank stage.
        try:
            raw_b = await r.get(_battle_active_key(room_id))
            if raw_b:
                b = json.loads(raw_b)
                b_remaining = float(b.get("deadline", 0)) - BATTLE_GRACE_SECONDS - time.time()
                if b_remaining > 1 and b.get("phrase"):
                    await websocket.send_json({
                        "type": "battle_start",
                        "battle_id": b["id"],
                        "ordinal": b.get("ordinal", 1),
                        "total": b.get("total", 1),
                        "phrase": b["phrase"],
                        "duration_seconds": int(b_remaining),
                        "audio_url": "",
                    })
        except Exception as e:
            print(f"[Livestream] battle restore failed: {e}")

        while True:
            msg = await websocket.receive_json()
            msg_type = msg.get("type")

            if msg_type == "start_lesson":
                room = await _load_room(r, room_id) or room
                if user_id == room["host_id"] and room["status"] == "waiting":
                    room["status"] = "live"
                    await _save_room(r, room)
                    await _broadcast(room_id, {"type": "lesson_start"})
                    _spawn(_deliver_lesson(room_id, settings))

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
                # Feed the teacher's perception loop (_maybe_teacher_aside)
                await r.hincrby(_signals_key(room_id), "questions", 1)
                await r.expire(_signals_key(room_id), ROOM_TTL)
                _spawn(_answer_question(room_id, question, user_name, settings))

            elif msg_type == "reaction":
                emoji = msg.get("emoji", "")
                if emoji in ALLOWED_REACTIONS:
                    # Light per-user cap so one client can't flood the room with
                    # reaction broadcasts (and skew the teacher-aside signals).
                    if await _is_rate_limited(r, f"{user_id}:react", 30):
                        continue
                    # Feed the teacher's perception loop (_maybe_teacher_aside)
                    await r.hincrby(_signals_key(room_id), f"r:{emoji}", 1)
                    await r.expire(_signals_key(room_id), ROOM_TTL)
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
                        _spawn(_answer_question(room_id, text, user_name, settings))

            elif msg_type == "end_speaking":
                # Speaker (or host) cancels the spotlight without submitting.
                room = await _load_room(r, room_id) or room
                current = await r.get(_speaker_key(room_id))
                if current and (current == user_id or user_id == room["host_id"]):
                    await r.delete(_speaker_key(room_id))
                    await _broadcast(room_id, {"type": "speaker_ended", "user_id": current})

            elif msg_type == "quiz_answer":
                # Live comprehension poll vote. First answer per user wins
                # (Kahoot-style lock — HSETNX), and only while the window is
                # open. The tally itself happens in _run_quiz after the window.
                raw_active = await r.get(_quiz_active_key(room_id))
                if not raw_active:
                    continue
                try:
                    active = json.loads(raw_active)
                    option = int(msg.get("option_index"))
                except (TypeError, ValueError, json.JSONDecodeError):
                    continue
                if str(msg.get("quiz_id")) != str(active.get("id")):
                    continue
                if time.time() > float(active.get("deadline", 0)):
                    continue
                if not (0 <= option < int(active.get("n_options", 0))):
                    continue
                answers_key = _quiz_answers_key(room_id, str(active["id"]))
                if await r.hsetnx(answers_key, user_id, option):
                    await r.expire(answers_key, 600)
                    # Live "N answered" ticker for everyone — builds the
                    # everyone-is-doing-this-right-now pressure.
                    await _broadcast(room_id, {
                        "type": "quiz_progress",
                        "quiz_id": active["id"],
                        "answered": await r.hlen(answers_key),
                    })
                # Ack with the LOCKED choice (may differ from this message if
                # the user double-tapped) so the UI shows the vote that counts.
                locked = await r.hget(answers_key, user_id)
                await websocket.send_json({
                    "type": "quiz_answer_ack",
                    "quiz_id": active["id"],
                    "option_index": int(locked) if locked is not None else option,
                })

            elif msg_type == "battle_recording":
                # A learner just started recording — the 'courage in numbers'
                # crowd signal, sent BEFORE any score exists so the room feels
                # populated the instant the window opens.
                raw_active = await r.get(_battle_active_key(room_id))
                if not raw_active:
                    continue
                try:
                    active = json.loads(raw_active)
                except json.JSONDecodeError:
                    continue
                if str(msg.get("battle_id")) != str(active.get("id")):
                    continue
                rec_key = _battle_recording_key(room_id)
                await r.sadd(rec_key, user_id)
                await r.expire(rec_key, BATTLE_SUBMIT_SECONDS + 10)
                await _broadcast(room_id, {
                    "type": "battle_recording_count",
                    "battle_id": active["id"],
                    "recording": await r.scard(rec_key),
                })

            elif msg_type == "battle_submit":
                # Pronunciation score. First submission per user wins (HSETNX),
                # only while the window is open — a learner can't re-record to
                # game the board. The final ranking happens in _run_battle.
                raw_active = await r.get(_battle_active_key(room_id))
                if not raw_active:
                    continue
                try:
                    active = json.loads(raw_active)
                    score = max(0, min(100, int(msg.get("score"))))
                except (TypeError, ValueError, json.JSONDecodeError):
                    continue
                if str(msg.get("battle_id")) != str(active.get("id")):
                    continue
                if time.time() > float(active.get("deadline", 0)):
                    continue
                answers_key = _battle_answers_key(room_id, str(active["id"]))
                entry = json.dumps({"score": score, "name": user_name})
                if await r.hsetnx(answers_key, user_id, entry):
                    await r.expire(answers_key, 600)
                    # Live-building leaderboard — scores trickle in over the
                    # window so ranks reshuffle in real time (the social payoff
                    # the quiz never had).
                    board: list[dict] = []
                    for uid, raw in (await r.hgetall(answers_key)).items():
                        try:
                            e = json.loads(raw)
                            board.append({
                                "user_id": uid,
                                "name": str(e.get("name", "Learner"))[:40],
                                "score": max(0, min(100, int(e.get("score", 0)))),
                            })
                        except (TypeError, ValueError, json.JSONDecodeError):
                            continue
                    board.sort(key=lambda e: e["score"], reverse=True)
                    await _broadcast(room_id, {
                        "type": "battle_progress",
                        "battle_id": active["id"],
                        "submitted": len(board),
                        "leaderboard": board[:8],
                    })
                # Ack the submitter with the LOCKED score (first write wins, so
                # this may differ from what they just sent).
                locked_raw = await r.hget(answers_key, user_id)
                locked_score = score
                if locked_raw:
                    try:
                        locked_score = int(json.loads(locked_raw).get("score", score))
                    except (TypeError, ValueError, json.JSONDecodeError):
                        pass
                await websocket.send_json({
                    "type": "battle_answer_ack",
                    "battle_id": active["id"],
                    "score": locked_score,
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
        # Only tear down if WE are still the registered socket for this user. On a
        # reconnect (token refresh, --reload restart, network blip) a NEWER socket
        # may have already replaced us under the same user_id; popping by user_id
        # here would evict that live socket and silently cut the client off from
        # every future broadcast (questions, answers, slides). If superseded, we
        # leave presence + registry to the connection that now owns them.
        conns = _connections.get(room_id)
        if user_id and conns is not None and conns.get(user_id) is websocket:
            conns.pop(user_id, None)
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
                    _spawn(_end_room_if_host_absent(room_id, user_id, settings))
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

        # Remember the planned slide count so a client (re)joining mid-lesson can
        # restore its progress bar from room_state alone. Reload first: the host
        # may have ended the room while the LLM was generating.
        room = await _load_room(r, room_id) or room
        room["total_sections"] = len(sections)
        await _save_room(r, room)

        # Kick off image fetch AND TTS synth for all sections in parallel.
        # Without this, each section had to wait for the next section's TTS to finish
        # (~5-10s gap of silence between sections). Doing them all upfront removes the gap.
        image_queries = [str(s.get("image_query", "")).strip() or room["topic"] for s in sections]
        section_texts = [f"{s['title']}. {s['content']}" for s in sections]

        # Warm class opening + sign-off. A real teacher greets the class before
        # diving in ("Hi everyone, today we're going to…") and hands off into Q&A
        # at the end — without this the AI jumped straight into slide 1.
        #   • The greeting is its OWN segment: spoken AND shown on screen (a
        #     `lesson_intro` broadcast with text + audio, played before slide 1).
        #   • The closing sign-off is folded onto the last slide's narration audio
        #     (spoken-only, no separate card needed).
        # Skipped on the generic fallback lesson: nothing specific to preview.
        narration_texts = list(section_texts)
        intro_text = ""
        if narration_texts and not used_fallback:
            lesson_focus_for_intro = (room.get("lesson_prompt", "") or "").strip() or room["topic"]
            intro_text = await _generate_intro(
                r, lesson_focus_for_intro,
                [str(s.get("title", "")).strip() for s in sections],
                level, lang, settings,
            )
            narration_texts[-1] = f"{narration_texts[-1]}\n\n{_closing_text(lang)}"

        # No checkpoint may land on the FINAL slide: the closing sign-off is
        # folded onto its narration (above), so a quiz/battle that fires after it
        # would pop up *after* the teacher has already said goodbye to the class.
        last_index = len(sections) - 1

        # Quiz checkpoints fire after every ~2 slides (0-based indices 1, 3, …).
        # Sections whose quiz failed validation are skipped silently — the
        # fallback template has no quizzes, so fallback lessons just play
        # straight through like before.
        quiz_by_index: dict[int, dict] = {}
        for i, s in enumerate(sections):
            if i % 2 == 1 and i != last_index:
                q = _extract_quiz(s)
                if q:
                    quiz_by_index[i] = q
        quiz_indices = sorted(quiz_by_index)

        # Choral pronunciation battles fire on EVEN slides (i>0) of a genuinely
        # speaking lesson — a different parity than quizzes (odd), so two heavy
        # checkpoints never land back-to-back. TRIPLE-GATED: the lesson-level
        # is_speaking_lesson flag AND a per-section phrase AND _extract_phrase's
        # deterministic validation. Capped so a lesson is never all battles.
        # Never on the last slide (see last_index) — the goodbye is already there.
        battle_by_index: dict[int, str] = {}
        for i, s in enumerate(sections):
            if i > 0 and i % 2 == 0 and i != last_index and s.get("_is_speaking_lesson"):
                phrase = _extract_phrase(s)
                if phrase:
                    battle_by_index[i] = phrase
        battle_indices = sorted(battle_by_index)[:MAX_BATTLES_PER_LESSON]
        battle_by_index = {i: battle_by_index[i] for i in battle_indices}

        # Spoken intro for the question and spoken reveal for the answer —
        # synthesized upfront with the slide narration so the checkpoint starts
        # with zero TTS latency.
        quiz_texts: list[str] = []
        for i in quiz_indices:
            q = quiz_by_index[i]
            correct_opt = q["options"][q["correct_index"]]
            if lang == "vi":
                quiz_texts.append(f"Câu hỏi nhanh cho cả lớp! {q['question']}")
                quiz_texts.append(f"Đáp án đúng là: {correct_opt}. {q['explanation']}")
            else:
                quiz_texts.append(f"Time for a quick check! {q['question']}")
                quiz_texts.append(f"The correct answer is: {correct_opt}. {q['explanation']}")

        # AI VO that frames each battle — the teacher models the phrase, then
        # leads the reveal. Pre-synthesized like the quiz clips. Worded to be
        # crowd-agnostic: this audio is made before anyone joins and a room is
        # usually just one learner, so it must NOT claim "the whole class/room"
        # (that rang false to solo learners) — the teacher leads YOU through it.
        battle_texts: list[str] = []
        for i in battle_indices:
            phrase = battle_by_index[i]
            if lang == "vi":
                battle_texts.append(f"Mình cùng luyện câu này nhé! Đọc to theo cô nào: {phrase}")
                battle_texts.append("Tốt lắm! Cùng xem bạn phát âm rõ tới đâu nhé.")
            else:
                battle_texts.append(f"Let's practice this one — read it aloud with me: {phrase}")
                battle_texts.append("Nicely done! Let's see how clearly that came through.")

        async def _safe_synth(text: str) -> str:
            if not text or not text.strip():
                return ""
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
        # The greeting clip is synthesized first (index 0); "" when skipped → ""
        # filename, which the broadcast guard below treats as "no intro".
        all_filenames = await asyncio.gather(
            *(_safe_synth(t) for t in [intro_text, *narration_texts, *quiz_texts, *battle_texts])
        )
        intro_filename = all_filenames[0]
        rest_filenames = all_filenames[1:]
        n_sec = len(narration_texts)
        n_quiz = len(quiz_texts)
        tts_filenames = rest_filenames[:n_sec]
        quiz_filenames = rest_filenames[n_sec:n_sec + n_quiz]
        battle_filenames = rest_filenames[n_sec + n_quiz:]
        try:
            image_urls = await image_task
        except Exception as e:
            print(f"[Livestream] Image fetch failed: {e}")
            image_urls = ["" for _ in sections]

        # Upload each clip to S3 (when configured) so any worker — and the replay
        # page days later — can serve it; falls back to the local audio route.
        async def _upload(fn: str) -> str:
            return await store_audio_and_url(AUDIO_DIR / fn, fn, settings.audio_base_url) if fn else ""

        audio_urls: list[str] = [await _upload(fn) for fn in tts_filenames]

        # quiz audio, keyed by section index: (question clip, explanation clip)
        quiz_audio: dict[int, dict] = {}
        for k, i in enumerate(quiz_indices):
            q_fn, e_fn = quiz_filenames[2 * k], quiz_filenames[2 * k + 1]
            quiz_audio[i] = {
                "q_url": await _upload(q_fn),
                "e_url": await _upload(e_fn),
                "e_fn": e_fn,
            }

        # battle audio, keyed by section index: (intro clip, reveal clip)
        battle_audio: dict[int, dict] = {}
        for k, i in enumerate(battle_indices):
            intro_fn, reveal_fn = battle_filenames[2 * k], battle_filenames[2 * k + 1]
            battle_audio[i] = {
                "intro_url": await _upload(intro_fn),
                "reveal_url": await _upload(reveal_fn),
                "reveal_fn": reveal_fn,
            }

        # Warm spoken+on-screen greeting, played BEFORE the first slide. The
        # client shows `text` as a welcome card and plays `audio_url`; we then
        # hold for the greeting's real audio length so slide 1's narration never
        # overlaps it. Guarded so a failed/empty intro just falls through to the
        # lesson as before.
        intro_audio_url = await _upload(intro_filename)
        if intro_text and intro_audio_url:
            room = await _load_room(r, room_id)
            if not room or room["status"] == "ended":
                return
            await _broadcast(room_id, {
                "type": "lesson_intro",
                "text": intro_text,
                "audio_url": intro_audio_url,
            })
            intro_estimate = max(4.0, len(intro_text.split()) / 2.3)
            await asyncio.sleep(_audio_duration(intro_filename, intro_estimate) + 0.5)

        sections_with_timing: list[dict] = []

        for i, section in enumerate(sections):
            # Hold between slides while a learner Q&A is being answered so the AI's
            # spoken reply doesn't overlap the next slide's narration. No-op when
            # no question is pending; bounded so a stuck answer can't freeze the lesson.
            await _wait_while_qa_active(r, room_id)

            room = await _load_room(r, room_id)
            if not room or room["status"] == "ended":
                break

            text = narration_texts[i]
            # Pace slide transitions by the REAL audio length (+0.5s tail) so the
            # narration never gets cut off by the next slide, and there are no long
            # silent gaps. Falls back to a word-count estimate if the MP3 can't be read.
            estimate = max(4.0, len(text.split()) / 2.3)
            duration = _audio_duration(tts_filenames[i], estimate) + 0.5
            audio_url = audio_urls[i]

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
                "audio_url": audio_url,
                "duration": duration,
                **slide_payload,
            })

            room["transcript"].append({
                "title": section["title"],
                "content": section["content"],
                **slide_payload,
            })
            await _save_room(r, room)

            await _broadcast(room_id, {
                "type": "lesson_chunk",
                "index": i,
                "total": len(sections),
                "title": section["title"],
                "content": section["content"],
                "audio_url": audio_url,
                **slide_payload,
            })

            await asyncio.sleep(duration)

            # ── Post-slide room events (run inline — the next slide waits) ──
            # Quiz checkpoint on every ~2 slides. Room status is re-checked
            # first: the host may have ended the room while the narration
            # played.
            quiz_record: dict | None = None

            quiz = quiz_by_index.get(i)
            if quiz:
                await _wait_while_qa_active(r, room_id)
                room = await _load_room(r, room_id)
                if not room or room["status"] == "ended":
                    break
                quiz_record = await _run_quiz(
                    r, room_id, i, quiz, quiz_audio.get(i, {}),
                    ordinal=quiz_indices.index(i) + 1, total=len(quiz_indices),
                )
                # Recording keeps the full quiz incl. the room's tally so a
                # future replay can re-render the checkpoint.
                sections_with_timing[-1]["quiz"] = quiz_record

            # Choral pronunciation battle on this slide? Same inline-blocking
            # pattern as the quiz; only ever reached on a real speaking section
            # (triple-gated when battle_by_index was built).
            phrase = battle_by_index.get(i)
            if phrase:
                await _wait_while_qa_active(r, room_id)
                room = await _load_room(r, room_id)
                if not room or room["status"] == "ended":
                    break
                battle_record = await _run_battle(
                    r, room_id, i, phrase, battle_audio.get(i, {}),
                    ordinal=battle_indices.index(i) + 1, total=len(battle_indices),
                )
                # Recording keeps the leaderboard so the replay can re-render
                # the podium.
                sections_with_timing[-1]["battle"] = battle_record

            # The teacher "sees" the room between slides: reactions, incoming
            # questions, quiz tallies. Skipped after the final slide — the Q&A
            # window opens immediately anyway.
            if i < len(sections) - 1:
                room = await _load_room(r, room_id)
                if not room or room["status"] == "ended":
                    break
                await _maybe_teacher_aside(
                    r, room_id, settings, lang=lang, level=level,
                    topic=room.get("lesson_prompt", "") or room["topic"],
                    quiz_record=quiz_record,
                )

        room = await _load_room(r, room_id)
        if not room:
            return

        # Persist the replay NOW — before the Q&A window — so the recording
        # exists even if the host ends the room (or drops past the reconnect
        # grace) before the 5-minute window runs out. That path used to skip
        # _save_recording entirely: the UI still offered "Watch replay" and the
        # learner got a 404. Partial lessons (host ended mid-slides) are saved
        # too — a partial replay beats none.
        if sections_with_timing:
            await _save_recording(r, room, sections_with_timing)

        if room["status"] == "live":
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
                    # Re-save so Q&A answered before the early end is kept.
                    if room and sections_with_timing:
                        await _save_recording(r, room, sections_with_timing)
                    return

            room = await _load_room(r, room_id)
            if room and room["status"] == "live":
                if sections_with_timing:
                    # Final save — includes every Q&A from the open window.
                    await _save_recording(r, room, sections_with_timing)
                room["status"] = "completed"
                await _save_room(r, room)
                await _broadcast(room_id, {"type": "lesson_complete"})
    except Exception as e:
        # A crash mid-delivery (LLM/TTS/Redis hiccup) used to leave the room
        # stuck in "live" forever with no slides and no way out — start_lesson
        # only fires from "waiting". Roll back so the host can simply retry.
        import traceback
        print(f"[Livestream] Lesson delivery crashed: {e!r}")
        traceback.print_exc()
        try:
            room = await _load_room(r, room_id)
            if room and room["status"] == "live":
                room["status"] = "waiting"
                await _save_room(r, room)
                await _broadcast(room_id, {"type": "lesson_error"})
        except Exception as e2:
            print(f"[Livestream] Lesson crash recovery failed: {e2!r}")
    finally:
        await r.aclose()


# ── Live quiz checkpoint runner ────────────────────────────────────────────────

async def _run_quiz(
    r: aioredis.Redis, room_id: str, quiz_id: int, quiz: dict, audio: dict,
    ordinal: int, total: int,
) -> dict:
    """Run one comprehension checkpoint, blocking the lesson loop by design.

    Flow: `quiz_start` opens a timed answer window (votes land in a Redis hash
    via the `quiz_answer` WS handler, possibly on other workers) → after the
    window closes, tally and broadcast `quiz_result` with the per-option counts,
    the correct answer, and the AI's spoken explanation → hold until the
    explanation finishes playing. Returns the quiz + tally for the recording.
    """
    n_options = len(quiz["options"])
    deadline = time.time() + QUIZ_ANSWER_SECONDS + QUIZ_GRACE_SECONDS
    # The active payload carries the full question so a client that (re)joins
    # mid-window can have the poll restored (see the join path in room_ws).
    # correct_index/explanation stay out of it — same no-spoiler rule as below.
    await r.set(_quiz_active_key(room_id), json.dumps({
        "id": quiz_id, "deadline": deadline, "n_options": n_options,
        "question": quiz["question"], "options": quiz["options"],
        "ordinal": ordinal, "total": total,
    }), ex=QUIZ_ANSWER_SECONDS + 60)

    # correct_index / explanation are deliberately withheld here — sending them
    # with quiz_start would put the answer one devtools tab away.
    await _broadcast(room_id, {
        "type": "quiz_start",
        "quiz_id": quiz_id,
        "ordinal": ordinal,
        "total": total,
        "question": quiz["question"],
        "options": quiz["options"],
        "duration_seconds": QUIZ_ANSWER_SECONDS,
        "audio_url": audio.get("q_url", ""),
    })

    await asyncio.sleep(QUIZ_ANSWER_SECONDS + QUIZ_GRACE_SECONDS)
    await r.delete(_quiz_active_key(room_id))

    answers_key = _quiz_answers_key(room_id, str(quiz_id))
    answers = await r.hgetall(answers_key)
    await r.delete(answers_key)
    counts = [0] * n_options
    for v in answers.values():
        try:
            idx = int(v)
        except (TypeError, ValueError):
            continue
        if 0 <= idx < n_options:
            counts[idx] += 1

    await _broadcast(room_id, {
        "type": "quiz_result",
        "quiz_id": quiz_id,
        "counts": counts,
        "total_answered": sum(counts),
        "correct_index": quiz["correct_index"],
        "explanation": quiz["explanation"],
        "audio_url": audio.get("e_url", ""),
    })

    # Hold the lecture while the class reads the chart and the AI speaks the
    # reveal — same real-audio-length pacing rule as slide narration.
    expl_estimate = max(QUIZ_RESULT_MIN_SECONDS, len(quiz["explanation"].split()) / 2.3 + 3.0)
    hold = _audio_duration(audio.get("e_fn", ""), expl_estimate) + 1.0
    await asyncio.sleep(max(hold, QUIZ_RESULT_MIN_SECONDS))

    return {
        **quiz,
        "counts": counts,
        "total_answered": sum(counts),
        "question_audio_url": audio.get("q_url", ""),
        "explanation_audio_url": audio.get("e_url", ""),
    }


# ── Live choral battle runner ──────────────────────────────────────────────────

async def _run_battle(
    r: aioredis.Redis, room_id: str, battle_id: int, phrase: str, audio: dict,
    ordinal: int, total: int,
) -> dict:
    """Run one synchronized choral pronunciation battle, blocking the lesson
    loop by design (mirrors _run_quiz).

    Flow: `battle_start` opens a shared countdown + read-aloud window (every
    learner reads the SAME phrase at the SAME second, scores their own attempt
    and submits one 0-100 score via the `battle_submit` WS handler — first write
    wins per user, HSETNX) → after the window we rank the answers hash and
    broadcast `battle_result` with the leaderboard → hold for the reveal VO.
    Returns the leaderboard for the recording.
    """
    deadline = time.time() + BATTLE_SUBMIT_SECONDS + BATTLE_GRACE_SECONDS
    # Full payload so a client that (re)joins mid-window can be restored.
    await r.set(_battle_active_key(room_id), json.dumps({
        "id": battle_id, "deadline": deadline, "phrase": phrase,
        "ordinal": ordinal, "total": total,
    }), ex=BATTLE_SUBMIT_SECONDS + 60)

    await _broadcast(room_id, {
        "type": "battle_start",
        "battle_id": battle_id,
        "ordinal": ordinal,
        "total": total,
        "phrase": phrase,
        "duration_seconds": BATTLE_SUBMIT_SECONDS,
        "audio_url": audio.get("intro_url", ""),
    })

    await asyncio.sleep(BATTLE_SUBMIT_SECONDS + BATTLE_GRACE_SECONDS)
    await r.delete(_battle_active_key(room_id))
    await r.delete(_battle_recording_key(room_id))

    answers_key = _battle_answers_key(room_id, str(battle_id))
    answers = await r.hgetall(answers_key)
    await r.delete(answers_key)
    leaderboard: list[dict] = []
    for uid, raw in answers.items():
        try:
            entry = json.loads(raw)
            leaderboard.append({
                "user_id": uid,
                "name": str(entry.get("name", "Learner"))[:40],
                "score": max(0, min(100, int(entry.get("score", 0)))),
            })
        except (TypeError, ValueError, json.JSONDecodeError):
            continue
    leaderboard.sort(key=lambda e: e["score"], reverse=True)

    await _broadcast(room_id, {
        "type": "battle_result",
        "battle_id": battle_id,
        "leaderboard": leaderboard,
        "total_submitted": len(leaderboard),
        "phrase": phrase,
        "audio_url": audio.get("reveal_url", ""),
    })

    # Hold the lecture while the room reads the podium and the AI speaks the
    # reveal — same real-audio-length pacing rule as the quiz.
    hold = _audio_duration(audio.get("reveal_fn", ""), BATTLE_RESULT_MIN_SECONDS) + 1.0
    await asyncio.sleep(max(hold, BATTLE_RESULT_MIN_SECONDS))

    return {
        "phrase": phrase,
        "leaderboard": leaderboard,
        "total_submitted": len(leaderboard),
        "intro_audio_url": audio.get("intro_url", ""),
        "reveal_audio_url": audio.get("reveal_url", ""),
    }


# ── Teacher aside: the AI reacts to what's happening in the room ───────────────

async def _maybe_teacher_aside(
    r: aioredis.Redis, room_id: str, settings, *,
    lang: str, level: str, topic: str,
    quiz_record: dict | None = None,
) -> None:
    """Between slides, let the AI teacher react to the room — or stay silent.

    Reads (and clears) the perception signals accumulated since the last slide
    (reaction counts, incoming questions) and folds in the outcome of a quiz
    that just ran. Only when the signals cross a threshold does it make ONE
    short LLM call for a single spoken sentence, TTS it, and broadcast it as
    `teacher_aside`. A quiet room costs zero extra LLM/TTS calls.
    """
    sig = await r.hgetall(_signals_key(room_id))
    await r.delete(_signals_key(room_id))

    reactions: dict[str, int] = {}
    for k, v in sig.items():
        if k.startswith("r:"):
            try:
                reactions[k[2:]] = int(v)
            except (TypeError, ValueError):
                pass
    try:
        questions = int(sig.get("questions", 0))
    except (TypeError, ValueError):
        questions = 0
    positive = sum(c for e, c in reactions.items() if e in POSITIVE_REACTIONS)
    confused = sum(c for e, c in reactions.items() if e in CONFUSED_REACTIONS)

    quiz_pct: int | None = None
    quiz_answered = int(quiz_record.get("total_answered", 0)) if quiz_record else 0
    if quiz_record and quiz_answered > 0:
        quiz_pct = round(
            100 * quiz_record["counts"][quiz_record["correct_index"]] / quiz_answered
        )

    # Speak only when there is genuinely something to react to.
    interesting = (
        positive + confused >= 3
        or confused >= 2
        or questions >= 2
        or (quiz_pct is not None and quiz_answered >= 2 and quiz_pct <= 50)
    )
    if not interesting:
        return

    facts: list[str] = []
    if lang == "vi":
        if positive:
            facts.append(f"{positive} cảm xúc tích cực (👍/🔥/👏) từ học viên")
        if confused:
            facts.append(f"{confused} cảm xúc bối rối/ngạc nhiên (🤔/😮)")
        if questions:
            facts.append(f"{questions} câu hỏi mới vừa được gửi")
        if quiz_pct is not None:
            facts.append(f"quiz vừa rồi: {quiz_pct}% trong {quiz_answered} câu trả lời là đúng")
        prompt = (
            f'Bạn là giáo viên tiếng Anh đang dạy livestream về "{topic}", '
            f'đang nói chuyện với lớp giữa hai slide.\n'
            f'Diễn biến trong lớp vừa rồi: {"; ".join(facts)}.\n'
            'Nói ĐÚNG 1 câu tiếng Việt tự nhiên (tối đa 28 từ) phản ứng với diễn biến đó — '
            'ghi nhận không khí lớp hoặc kết quả, khen đích danh khi xứng đáng, '
            'và nói bạn sẽ làm gì tiếp (ôn nhanh, đi tiếp…). '
            'Chỉ trả về câu nói. Không ngoặc kép, không markdown, không emoji.'
        )
    else:
        if positive:
            facts.append(f"{positive} positive reactions (👍/🔥/👏) from students")
        if confused:
            facts.append(f"{confused} confused/surprised reactions (🤔/😮)")
        if questions:
            facts.append(f"{questions} new student questions just came in")
        if quiz_pct is not None:
            facts.append(f"the quiz that just ran: {quiz_pct}% of {quiz_answered} answers were correct")
        prompt = (
            f'You are a live English teacher mid-lesson on "{topic}", '
            f'speaking to your class between two slides.\n'
            f'What just happened in the room: {"; ".join(facts)}.\n'
            'Say EXACTLY 1 natural spoken sentence (max 28 words) reacting to it — '
            'acknowledge the class mood or result, praise by name when deserved, '
            'and say what you will do next (quick recap, keep going…). '
            'Return only the sentence. No quotes, no markdown, no emoji.'
        )

    try:
        text = (await generate_text(
            prompt, settings, temperature=0.7, max_tokens=120, timeout=12,
        )).strip().strip('"').strip()
    except Exception as e:
        print(f"[Aside] LLM error: {e}")
        return
    if not text:
        return
    text = text[:300]

    audio_url = ""
    filename = ""
    try:
        filename = await synthesize_to_file(
            _normalize_tts(text), level, lang,
            provider=settings.tts_provider,
            credentials_path=settings.google_application_credentials,
        )
        audio_url = await store_audio_and_url(AUDIO_DIR / filename, filename, settings.audio_base_url)
    except Exception as e:
        print(f"[Aside] TTS failed: {e}")

    await _broadcast(room_id, {"type": "teacher_aside", "text": text, "audio_url": audio_url})

    # Hold the lecture while the aside plays — bounded so a weird clip can
    # never stall the lesson.
    hold = _audio_duration(filename, max(3.0, len(text.split()) / 2.3)) + 0.5
    await asyncio.sleep(min(hold, ASIDE_MAX_HOLD_SECONDS))


# ── Background: answer question ────────────────────────────────────────────────

async def _answer_question(room_id: str, question: str, user_name: str, settings):
    r = await _get_redis(settings)
    qa_started = False
    # Unique id tying this question's `question_asked` / `ai_answer_chunk` /
    # `ai_answer` messages together. Clients key the answer bubble on it — two
    # answers streaming concurrently used to interleave and spawn a new chat
    # bubble per chunk (the client matched on "last message's user_name").
    qa_id = uuid.uuid4().hex[:12]
    try:
        room = await _load_room(r, room_id)
        if not room:
            return

        # Pause slide delivery for the whole Q&A (generation + spoken answer) so the
        # lecture doesn't roll on to the next slide while the AI is answering.
        await _qa_begin(r, room_id)
        qa_started = True

        await _broadcast(room_id, {
            "type": "question_asked", "qa_id": qa_id,
            "user_name": user_name, "question": question,
        })

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
                "7. Trình bày rõ ràng — Hãy dùng Markdown (in đậm, in nghiêng, danh sách gạch đầu dòng, tiêu đề) để câu trả lời dễ đọc, có cấu trúc tốt như ChatGPT. Phân đoạn bằng dòng trống.\n"
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
                "7. Format clearly — Use Markdown (bold, italics, bullet points, headers) so the answer is easy to read and well-structured like ChatGPT. Separate paragraphs with blank lines.\n"
                "8. NEVER stop midway. Your answer MUST have a complete opening, body, and conclusion."
            )
            fallback = (
                "That question is right on track with today's focus. Try applying the techniques "
                "from the lesson — write out 2-3 attempts and compare them to spot the pattern."
            )

        answer = ""
        stream_status: dict = {}
        try:
            async for chunk in generate_text_stream(
                prompt, settings,
                temperature=0.55, max_tokens=2048, timeout=90,
                status=stream_status,
            ):
                answer += chunk
                await _broadcast(room_id, {
                    "type": "ai_answer_chunk",
                    "qa_id": qa_id,
                    "question": question,
                    "user_name": user_name,
                    "chunk": chunk,
                    "text_so_far": answer
                })
        except Exception as e:
            print(f"[Q&A] LLM error: {e}")

        # The Gemini free tier sometimes drops the stream mid-answer (rate-limit /
        # closed connection), leaving `answer` truncated. Without this check the
        # cut-off text would be spoken and saved as the final answer (e.g. the
        # "Chào … R" bug). Regenerate the full answer non-streaming (full key
        # rotation) and replace it — the client's `ai_answer` handler overwrites
        # the partial text it streamed, so the user sees the complete reply.
        if answer and not stream_status.get("complete"):
            print(f"[Q&A] stream incomplete (finish={stream_status.get('finish_reason')}, {len(answer)} chars) — repairing non-streaming")
            try:
                full = await generate_text(
                    prompt, settings,
                    temperature=0.55, max_tokens=2048, timeout=90,
                )
                if full and len(full.strip()) > len(answer.strip()):
                    answer = full.strip()
            except Exception as e:
                print(f"[Q&A] repair generation failed: {e}")

        if not answer:
            answer = fallback

        audio_url = ""
        filename = ""
        try:
            filename = await synthesize_to_file(
                _normalize_tts(answer), level, lang,
                provider=settings.tts_provider,
                credentials_path=settings.google_application_credentials,
            )
            audio_url = await store_audio_and_url(AUDIO_DIR / filename, filename, settings.audio_base_url)
        except Exception as e:
            print(f"[TTS Q&A] Failed: {e}")

        # Persist Q&A (own Redis list — see _append_qa) so it's included in the
        # recording without racing _deliver_lesson's writes to the room JSON.
        await _append_qa(r, room_id, {
            "user_name": user_name,
            "question": question,
            "answer": answer,
            "audio_url": audio_url,
        })

        await _broadcast(room_id, {
            "type": "ai_answer",
            "qa_id": qa_id,
            "question": question,
            "user_name": user_name,
            "answer": answer,
            "audio_url": audio_url,
        })

        # Keep the lecture paused while clients play the answer audio, so the next
        # slide only resumes once the AI has finished speaking. Use the real clip
        # length (falls back to a word-count estimate if it can't be read).
        answer_estimate = max(4.0, len(answer.split()) / 2.3)
        answer_secs = _audio_duration(filename, answer_estimate) if filename else answer_estimate
        await asyncio.sleep(answer_secs + 0.5)
    finally:
        if qa_started:
            try:
                await _qa_end(r, room_id)
            except Exception as e:
                print(f"[Q&A] Failed to clear pause flag: {e}")
        await r.aclose()

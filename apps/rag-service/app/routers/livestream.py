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
import tempfile
import time
import uuid
from datetime import datetime
from pathlib import Path

import edge_tts
import httpx
import jwt as pyjwt
from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from pydantic import BaseModel
import redis.asyncio as aioredis

router = APIRouter(prefix="/api/livestream", tags=["Livestream"])

# ── Audio temp directory ───────────────────────────────────────────────────────
AUDIO_DIR = Path(tempfile.gettempdir()) / "livestream_audio"

# ── In-process WebSocket registry ─────────────────────────────────────────────
_connections: dict[str, dict[str, WebSocket]] = {}
_user_names: dict[str, dict[str, str]] = {}

# ── Constants ──────────────────────────────────────────────────────────────────
VOICES = {
    "beginner": "en-US-JennyNeural",
    "intermediate": "en-US-AriaNeural",
    "advanced": "en-GB-SoniaNeural",
}
LEVEL_LABELS = {
    "beginner": "Beginner (A1–A2)",
    "intermediate": "Intermediate (B1–B2)",
    "advanced": "Advanced (C1–C2)",
}
OLLAMA_OPTIONS = {"temperature": 0.7, "num_predict": 1024, "num_ctx": 4096, "top_p": 0.9}
ROOM_TTL = 86400        # 24 h
RECORDING_TTL = 7 * 86400  # 7 days


# ── Pydantic models ────────────────────────────────────────────────────────────

class CreateRoomRequest(BaseModel):
    topic: str
    level: str = "intermediate"
    host_id: str
    host_name: str


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


# ── TTS → disk ────────────────────────────────────────────────────────────────

async def _tts_to_file(text: str, voice: str) -> str:
    filename = f"{uuid.uuid4().hex}.mp3"
    path = AUDIO_DIR / filename
    communicate = edge_tts.Communicate(text, voice)
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    await asyncio.to_thread(path.write_bytes, audio_data)
    return filename


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

_LESSON_PROMPT = """You are a friendly English teacher. Create a structured lesson about "{topic}" for {level} English learners.

Generate exactly 5 lesson sections. Each section has a short title and 2-3 sentences of clear content.
Respond ONLY with valid JSON, no extra text:
{{"sections": [{{"title": "string", "content": "string"}}, {{"title": "string", "content": "string"}}, {{"title": "string", "content": "string"}}, {{"title": "string", "content": "string"}}, {{"title": "string", "content": "string"}}]}}

Requirements: plain text only in content, {level}-appropriate vocabulary."""


def _fallback_sections(topic: str, level: str) -> list[dict]:
    return [
        {"title": "Welcome & Introduction",
         "content": f"Welcome to today's lesson about {topic}. This topic is very useful for {level} English learners. Let's explore it step by step together."},
        {"title": "Key Vocabulary",
         "content": f"First, let's look at the most important words related to {topic}. Learning these words will help you understand and talk about this topic with confidence."},
        {"title": "Core Concepts",
         "content": f"The main ideas behind {topic} can be broken down into a few simple parts. Once you understand each part, the whole picture becomes much clearer."},
        {"title": "Real-Life Examples",
         "content": f"Let's see how {topic} appears in everyday English. These examples will show you when and how to use what you have learned today."},
        {"title": "Summary & Practice Tips",
         "content": f"Great job reaching the end of our lesson on {topic}! Review today's vocabulary, practice using the examples, and you will improve quickly."},
    ]


async def _generate_lesson(topic: str, level: str, ollama_url: str, model: str) -> list[dict]:
    prompt = _LESSON_PROMPT.format(topic=topic, level=level)
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{ollama_url}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False, "options": OLLAMA_OPTIONS},
            )
        raw = resp.json().get("response", "")
        start, end = raw.find("{"), raw.rfind("}") + 1
        if start >= 0 and end > start:
            sections = json.loads(raw[start:end]).get("sections", [])
            if sections:
                return sections
    except Exception as e:
        print(f"[Livestream] Lesson generation failed: {e}")
    return _fallback_sections(topic, level)


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
                    "level": room["level"],
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
            "level": body.level,
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
                asyncio.create_task(_answer_question(room_id, question, user_name, settings))

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
            await _broadcast(room_id, {
                "type": "participant_leave",
                "participant_count": len(_connections.get(room_id, {})),
            })
            r2 = await _get_redis(__import__('app.config', fromlist=['get_settings']).get_settings())
            try:
                room = await _load_room(r2, room_id)
                if room and uid == room["host_id"] and room["status"] not in ("ended", "completed"):
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

        voice = VOICES.get(room["level"], "en-US-AriaNeural")
        await _broadcast(room_id, {"type": "lesson_generating"})

        sections = await _generate_lesson(
            room["topic"], room["level"],
            settings.ollama_base_url, settings.ollama_model,
        )

        sections_with_timing: list[dict] = []

        for i, section in enumerate(sections):
            room = await _load_room(r, room_id)
            if not room or room["status"] == "ended":
                break

            text = f"{section['title']}. {section['content']}"
            duration = max(4.0, len(text.split()) / 2.3)

            audio_url = ""
            try:
                filename = await _tts_to_file(text, voice)
                audio_url = f"{settings.audio_base_url}/api/livestream/audio/{filename}"
            except Exception as e:
                print(f"[TTS] Failed: {e}")

            sections_with_timing.append({
                "index": i,
                "title": section["title"],
                "content": section["content"],
                "audio_url": audio_url,
                "duration": duration,
            })

            room["transcript"].append({"title": section["title"], "content": section["content"]})
            await _save_room(r, room)

            await _broadcast(room_id, {
                "type": "lesson_chunk",
                "index": i,
                "total": len(sections),
                "title": section["title"],
                "content": section["content"],
                "audio_url": audio_url,
            })

            await asyncio.sleep(duration)

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

        voice = VOICES.get(room["level"], "en-US-AriaNeural")

        prompt = (
            f'You are a friendly English teacher. Student "{user_name}" asked: "{question}"\n'
            f'Lesson topic: "{room["topic"]}", level: {room["level"]}.\n'
            "Answer helpfully in 2-3 clear sentences. Plain text only."
        )

        answer = ""
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    f"{settings.ollama_base_url}/api/generate",
                    json={"model": settings.ollama_model, "prompt": prompt, "stream": False,
                          "options": {"temperature": 0.5, "num_predict": 256}},
                )
            answer = resp.json().get("response", "").strip()
        except Exception as e:
            print(f"[Q&A] Ollama error: {e}")

        if not answer:
            answer = f"Great question, {user_name}! Keep practicing and you will master it!"

        audio_url = ""
        try:
            filename = await _tts_to_file(answer, voice)
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

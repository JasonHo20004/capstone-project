"""
RAG Service - Course Service Client
HTTP client to persist completed livestream lessons to course-service's durable
Postgres archive (the live session itself lives only in Redis with a 7-day TTL).
"""

import httpx

from app.config import get_settings


async def save_recording_to_course_service(recording: dict) -> bool:
    """Upsert a finished livestream recording into course-service (Postgres).

    Best-effort: the live lesson already succeeded by the time this runs, so any
    failure here is logged and swallowed — it must never break the session.

    `recording` is the same dict written to Redis by `_save_recording` (snake_case
    keys); we map it to the course-service JSON contract (camelCase).
    """
    settings = get_settings()
    base = (settings.course_service_url or "").rstrip("/")
    if not base:
        return False

    room_id = recording.get("room_id")
    if not room_id:
        return False

    payload = {
        "roomId": room_id,
        "topic": recording.get("topic"),
        "level": recording.get("level"),
        "levelLabel": recording.get("level_label"),
        "hostId": recording.get("host_id"),
        "hostName": recording.get("host_name"),
        "language": recording.get("language"),
        "sections": recording.get("sections", []),
        "qa": recording.get("qa", []),
        "completedAt": recording.get("completed_at"),
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"{base}/api/livestream-recordings/internal",
                json=payload,
            )
        if resp.status_code not in (200, 201):
            print(f"[Livestream] Persist to course-service failed: {resp.status_code} {resp.text}")
            return False
        return True
    except Exception as e:
        print(f"[Livestream] Persist to course-service error: {e}")
        return False


async def list_recordings_from_course_service() -> list[dict]:
    """Recording summaries from the durable Postgres archive, mapped to the
    same snake_case shape rag-service's GET /recordings serves from Redis.

    Best-effort: the archive being down only hides >7-day-old replays, so any
    error is logged and an empty list returned.
    """
    settings = get_settings()
    base = (settings.course_service_url or "").rstrip("/")
    if not base:
        return []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{base}/api/livestream-recordings/internal",
                params={"limit": 100},
            )
        if resp.status_code != 200:
            print(f"[Livestream] Archive list failed: {resp.status_code}")
            return []
        items = (resp.json().get("data") or {}).get("items") or []
        out: list[dict] = []
        for it in items:
            out.append({
                "room_id": it.get("roomId"),
                "topic": it.get("topic"),
                "level": it.get("level"),
                "level_label": it.get("levelLabel"),
                "host_name": it.get("hostName"),
                "language": it.get("language"),
                "completed_at": it.get("completedAt"),
                "section_count": int(it.get("sectionCount") or 0),
                "qa_count": int(it.get("qaCount") or 0),
                "duration_seconds": float(it.get("durationSeconds") or 0),
            })
        return out
    except Exception as e:
        print(f"[Livestream] Archive list error: {e}")
        return []


async def get_recording_from_course_service(room_id: str) -> dict | None:
    """Full recording (sections + qa) from the Postgres archive — the fallback
    when the Redis copy has expired (7-day TTL). Returns None when missing or
    on any error."""
    settings = get_settings()
    base = (settings.course_service_url or "").rstrip("/")
    if not base or not room_id:
        return None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{base}/api/livestream-recordings/internal/{room_id}",
            )
        if resp.status_code != 200:
            return None
        rec = (resp.json().get("data")) or {}
        if not rec.get("roomId"):
            return None
        return {
            "room_id": rec.get("roomId"),
            "topic": rec.get("topic"),
            "level": rec.get("level"),
            "level_label": rec.get("levelLabel"),
            "host_id": rec.get("hostId"),
            "host_name": rec.get("hostName"),
            "language": rec.get("language"),
            "completed_at": rec.get("completedAt"),
            "sections": rec.get("sections") or [],
            "qa": rec.get("qa") or [],
        }
    except Exception as e:
        print(f"[Livestream] Archive get error: {e}")
        return None

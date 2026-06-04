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

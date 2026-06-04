"""
Audio storage abstraction.

When AWS S3 is configured (AWS_S3_BUCKET + credentials), synthesized MP3s are
uploaded to S3 and served from a durable public URL — this is required when the
service runs with more than one worker/replica, because each worker has its own
local disk and could not otherwise serve another worker's audio files. When S3
is not configured, audio is served from local disk (dev fallback).

Env vars (same names as the Node services' s3.service.ts):
  AWS_REGION             (default: ap-south-1)
  AWS_S3_BUCKET
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
"""

import asyncio
import os
from pathlib import Path

try:
    import boto3
    _BOTO3_AVAILABLE = True
except ImportError:
    boto3 = None  # type: ignore
    _BOTO3_AVAILABLE = False


AUDIO_FOLDER = "livestream-audio"
_client = None


def _bucket() -> str:
    return os.environ.get("AWS_S3_BUCKET", "")


def _region() -> str:
    return os.environ.get("AWS_REGION", "ap-south-1")


def is_s3_configured() -> bool:
    return (
        _BOTO3_AVAILABLE
        and bool(_bucket())
        and bool(os.environ.get("AWS_ACCESS_KEY_ID"))
        and bool(os.environ.get("AWS_SECRET_ACCESS_KEY"))
    )


def _get_client():
    global _client
    if _client is None:
        _client = boto3.client("s3", region_name=_region())
    return _client


def s3_url(filename: str) -> str:
    return f"https://{_bucket()}.s3.{_region()}.amazonaws.com/{AUDIO_FOLDER}/{filename}"


def _upload_sync(path: Path, filename: str) -> bool:
    try:
        _get_client().upload_file(
            str(path), _bucket(), f"{AUDIO_FOLDER}/{filename}",
            ExtraArgs={"ContentType": "audio/mpeg"},
        )
        return True
    except Exception as e:
        print(f"[Storage] S3 upload failed for {filename}: {e}")
        return False


async def store_audio_and_url(local_path: Path, filename: str, local_base: str) -> str:
    """Return the URL a client should fetch this audio from.

    Uploads to S3 (off the event loop) when configured and the upload succeeds;
    otherwise falls back to the local /api/livestream/audio/{filename} route.
    """
    if filename and is_s3_configured():
        ok = await asyncio.to_thread(_upload_sync, local_path, filename)
        if ok:
            return s3_url(filename)
    return f"{local_base}/api/livestream/audio/{filename}"

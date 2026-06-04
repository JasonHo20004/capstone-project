"""
RAG Service - Whisper Transcription Service

Runs OpenAI Whisper locally on CPU via faster-whisper (CTranslate2 backend).
faster-whisper bundles its own audio decoding (PyAV), so no system ffmpeg
install is required — important for Windows admin machines.

The model is loaded lazily and cached for the process lifetime: the first
transcription downloads (~1.5GB for large-v3-turbo) and warms the model, every
subsequent call reuses it. Transcription is CPU-bound, so callers should invoke
`transcribe()` from a worker thread (e.g. `await asyncio.to_thread(...)`).
"""

from __future__ import annotations

import threading
from dataclasses import dataclass

from app.config import get_settings


@dataclass
class TWord:
    """One word with its timestamps — mirrors the shape the dictation pipeline
    expects (word/start/end)."""
    word: str
    start: float
    end: float


@dataclass
class TSegment:
    """One Whisper segment with optional word-level timestamps."""
    text: str
    start: float
    end: float
    words: list[TWord]


_model = None
_model_key: tuple[str, str, str] | None = None
_lock = threading.Lock()


def _get_model():
    """Lazily load (and cache) the faster-whisper model for the configured
    model name / device / compute type. Reloads only if those settings change."""
    global _model, _model_key

    settings = get_settings()
    key = (settings.whisper_model, settings.whisper_device, settings.whisper_compute_type)

    if _model is not None and _model_key == key:
        return _model

    with _lock:
        # Re-check inside the lock (another thread may have loaded it).
        if _model is not None and _model_key == key:
            return _model

        from faster_whisper import WhisperModel

        print(
            f"[Whisper] Loading model '{key[0]}' "
            f"(device={key[1]}, compute={key[2]}) — first run downloads ~1.5GB..."
        )
        _model = WhisperModel(key[0], device=key[1], compute_type=key[2])
        _model_key = key
        print("[Whisper] Model ready.")

    return _model


def transcribe(audio_path: str, language: str = "en") -> list[TSegment]:
    """Transcribe an audio file with word-level timestamps.

    Returns a materialized list of segments (faster-whisper yields a lazy
    generator; we drain it here so the work happens within the worker thread).
    `vad_filter` trims long silences, which also cuts down on hallucinated
    segments before our own pipeline runs.
    """
    model = _get_model()

    segments_gen, _info = model.transcribe(
        audio_path,
        language=language,
        word_timestamps=True,
        vad_filter=True,
    )

    segments: list[TSegment] = []
    for seg in segments_gen:
        words = [
            TWord(word=w.word, start=float(w.start), end=float(w.end))
            for w in (seg.words or [])
            if w.start is not None and w.end is not None
        ]
        segments.append(
            TSegment(
                text=seg.text or "",
                start=float(seg.start),
                end=float(seg.end),
                words=words,
            )
        )

    return segments

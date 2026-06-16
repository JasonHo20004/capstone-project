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


# Cache one model instance per (name, device, compute_type). The admin dictation
# feature uses the high-accuracy default model while the live speaking battle
# uses a small fast model — both can be resident at once, each loaded on first
# use and reused for the process lifetime.
_models: dict[tuple[str, str, str], object] = {}
_lock = threading.Lock()


def _get_model(model_name: str | None = None):
    """Lazily load (and cache) the faster-whisper model for `model_name` (or the
    configured default) at the configured device / compute type."""
    settings = get_settings()
    name = model_name or settings.whisper_model
    key = (name, settings.whisper_device, settings.whisper_compute_type)

    cached = _models.get(key)
    if cached is not None:
        return cached

    with _lock:
        # Re-check inside the lock (another thread may have loaded it).
        cached = _models.get(key)
        if cached is not None:
            return cached

        from faster_whisper import WhisperModel

        print(
            f"[Whisper] Loading model '{key[0]}' "
            f"(device={key[1]}, compute={key[2]}) — first run downloads the weights..."
        )
        model = WhisperModel(key[0], device=key[1], compute_type=key[2])
        _models[key] = model
        print(f"[Whisper] Model '{key[0]}' ready.")

    return _models[key]


def warmup(model_name: str | None = None) -> None:
    """Pre-load a model so the first real request isn't slowed by the
    download/load. Safe to call from a background thread; never raises."""
    try:
        _get_model(model_name)
    except Exception as exc:  # pragma: no cover — best-effort warmup
        print(f"[Whisper] Warmup failed for '{model_name}': {exc}")


def transcribe(audio_path: str, language: str = "en", model_name: str | None = None) -> list[TSegment]:
    """Transcribe an audio file with word-level timestamps.

    `model_name` selects a non-default model (e.g. the fast battle model);
    omit it for the configured default. Returns a materialized list of segments
    (faster-whisper yields a lazy generator; we drain it here so the work happens
    within the worker thread). `vad_filter` trims long silences, which also cuts
    down on hallucinated segments before our own pipeline runs.
    """
    model = _get_model(model_name)

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

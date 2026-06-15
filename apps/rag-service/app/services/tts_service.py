"""
Unified TTS service: Google Cloud Chirp 3: HD (premium) -> Edge-TTS (free fallback).

Provider is chosen via Settings.tts_provider. If gcloud is selected but credentials
are missing or the API call fails, we silently fall back to edge-tts so the
livestream keeps working.
"""

import asyncio
import os
import re
import tempfile
import uuid
from pathlib import Path

import edge_tts

try:
    from google.cloud import texttospeech as gtts
    _GCLOUD_AVAILABLE = True
except ImportError:
    gtts = None  # type: ignore
    _GCLOUD_AVAILABLE = False


AUDIO_DIR = Path(tempfile.gettempdir()) / "livestream_audio"


# ── Voice tables ─────────────────────────────────────────────────────────────

_EDGE_VOICES_EN = {
    "beginner":     "en-US-JennyNeural",
    "intermediate": "en-US-AriaNeural",
    "advanced":     "en-GB-SoniaNeural",
}
_EDGE_VOICES_VI = {
    "beginner":     "vi-VN-HoaiMyNeural",
    "intermediate": "vi-VN-HoaiMyNeural",
    "advanced":     "vi-VN-HoaiMyNeural",  # all-female (HoaiMy is the only vi-VN female neural voice)
}

# Google Cloud Chirp 3: HD (Google's newest generative voices, noticeably more
# natural & expressive than Neural2). All-female. Chirp3-HD voices do NOT support
# SSML, but English content doesn't need the <lang> accent trick anyway.
_GCLOUD_VOICES_EN = {
    "beginner":     ("en-US", "en-US-Chirp3-HD-Aoede"),  # warm, friendly female
    "intermediate": ("en-US", "en-US-Chirp3-HD-Kore"),   # clear, confident female
    "advanced":     ("en-GB", "en-GB-Chirp3-HD-Leda"),   # bright British female
}
# Vietnamese — Chirp 3: HD. IMPORTANT: Chirp3-HD voices do NOT support SSML, so
# the English-accent <lang> wrapping is skipped for them (see _synthesize_gcloud)
# — the Vietnamese voice reads embedded English words natively instead. All-female.
_GCLOUD_VOICES_VI = {
    "beginner":     ("vi-VN", "vi-VN-Chirp3-HD-Aoede"),  # warm, expressive female
    "intermediate": ("vi-VN", "vi-VN-Chirp3-HD-Aoede"),  # warm, expressive female
    "advanced":     ("vi-VN", "vi-VN-Chirp3-HD-Aoede"),  # warm, expressive female
}


def pick_edge_voice(level: str, language: str) -> str:
    table = _EDGE_VOICES_VI if language == "vi" else _EDGE_VOICES_EN
    return table.get(level, "en-US-AriaNeural")


def pick_gcloud_voice(level: str, language: str) -> tuple[str, str]:
    table = _GCLOUD_VOICES_VI if language == "vi" else _GCLOUD_VOICES_EN
    return table.get(level, ("en-US", "en-US-Chirp3-HD-Aoede"))


# ── Mixed-language SSML wrapping ─────────────────────────────────────────────
# When a Vietnamese lesson contains English words (vocab, examples), wrap the
# English runs in <lang xml:lang="en-US">...</lang> so Google's vi-VN voice
# pronounces them with a native English accent instead of Việt-ifying them.

# Vietnamese-specific characters used as a marker that a token is Vietnamese.
_VN_CHARS = set(
    "ăâđêôơưĂÂĐÊÔƠƯ"
    "àáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ"
    "ÀÁẢÃẠẰẮẲẴẶẦẤẨẪẬÈÉẺẼẸỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌỒỐỔỖỘỜỚỞỠỢÙÚỦŨỤỪỨỬỮỰỲÝỶỸỴ"
)

_TOKEN_RE = re.compile(r"\S+|\s+", re.UNICODE)

# Rare-in-Vietnamese digraphs / patterns. If a pure-ASCII word contains any of
# these, it's almost certainly English. Conservative: leaves ambiguous words
# (e.g. "thi", "nay") to the Vietnamese voice rather than risk weird accents.
_ENGLISH_PATTERN_RE = re.compile(
    r"(oo|ee|aa|ea|sh|wh|ck|kn|sw|sk|sp"
    r"|ll|tt|ss|ff|mm|nn|pp|rr|dd|gg|bb|cc|zz)",
    re.IGNORECASE,
)
_ENGLISH_SUFFIX_RE = re.compile(
    r"(ing|tion|sion|ment|ness|able|ible|ous|ful|less)$",
    re.IGNORECASE,
)


def _is_strong_english_token(tok: str) -> bool:
    """Confidence: this token has a rare-in-Vietnamese English marker."""
    letters = re.sub(r"[^A-Za-z]", "", tok)
    if len(letters) < 3:
        return False
    if any(c in _VN_CHARS for c in tok):
        return False
    if letters.isupper():
        return True  # ALLCAPS acronym
    if (not letters.islower() and not letters.isupper()
            and not letters[0].isupper()):
        return True  # camelCase
    if _ENGLISH_PATTERN_RE.search(letters):
        return True
    if _ENGLISH_SUFFIX_RE.search(letters):
        return True
    return False


def _is_maybe_english_token(tok: str) -> bool:
    """Looser: any pure-ASCII letter token without Vietnamese diacritics."""
    letters = re.sub(r"[^A-Za-z]", "", tok)
    if len(letters) < 1:
        return False
    if any(c in _VN_CHARS for c in tok):
        return False
    return all(c.isascii() and c.isalpha() for c in letters)


def _is_vietnamese_token(tok: str) -> bool:
    """Has at least one Vietnamese diacritic mark."""
    return any(c in _VN_CHARS for c in tok)


def _xml_escape(s: str) -> str:
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;")
             .replace('"', "&quot;")
             .replace("'", "&apos;"))


def _wrap_english_in_ssml(text: str) -> tuple[str, bool]:
    """
    Wrap English token-runs in <lang xml:lang="en-US"> tags.

    Algorithm:
      1. Classify each token as STRONG_ENG / MAYBE_ENG / VI / OTHER (punct, num).
      2. Mark each STRONG_ENG as English.
      3. Transitive expand: any MAYBE_ENG adjacent to an English token
         (across whitespace and OTHER tokens) also becomes English.
      4. Vietnamese tokens act as a hard barrier.
      5. Emit, merging consecutive English tokens into one <lang> wrap.
    """
    tokens = _TOKEN_RE.findall(text)
    if not tokens:
        return _xml_escape(text), False

    STRONG, MAYBE, VI, OTHER, WS = "S", "M", "V", "O", "W"
    kinds: list[str] = []
    for t in tokens:
        if t.isspace():
            kinds.append(WS)
        elif _is_vietnamese_token(t):
            kinds.append(VI)
        elif _is_strong_english_token(t):
            kinds.append(STRONG)
        elif _is_maybe_english_token(t):
            kinds.append(MAYBE)
        else:
            kinds.append(OTHER)

    is_eng = [k == STRONG for k in kinds]

    # Rule: 3+ consecutive non-Vietnamese letter-tokens (MAYBE or STRONG) form
    # an English-only phrase like "I am a student" — flag the whole run.
    i = 0
    while i < len(kinds):
        if kinds[i] in (MAYBE, STRONG):
            j = i
            ascii_count = 0
            indices: list[int] = []
            while j < len(kinds) and kinds[j] != VI:
                if kinds[j] in (MAYBE, STRONG):
                    ascii_count += 1
                    indices.append(j)
                j += 1
            if ascii_count >= 3:
                for idx in indices:
                    is_eng[idx] = True
            i = j
        else:
            i += 1

    if not any(is_eng):
        return _xml_escape(text), False

    # Emit: merge runs of [English | WS | OTHER] (no VI in between) into one wrap.
    out: list[str] = []
    i = 0
    while i < len(tokens):
        if is_eng[i]:
            j = i
            last_eng = i
            while j < len(tokens):
                if kinds[j] == VI:
                    break
                if is_eng[j]:
                    last_eng = j
                elif kinds[j] not in (WS, OTHER):
                    break
                j += 1
            run = "".join(tokens[i:last_eng + 1])
            out.append(f'<lang xml:lang="en-US">{_xml_escape(run)}</lang>')
            i = last_eng + 1
        else:
            out.append(_xml_escape(tokens[i]))
            i += 1

    return "".join(out), True


# ── Synthesis backends ───────────────────────────────────────────────────────

async def _synthesize_edge(text: str, level: str, language: str) -> bytes:
    voice = pick_edge_voice(level, language)
    communicate = edge_tts.Communicate(text, voice)
    audio = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
    return audio


_gcloud_client = None


def _get_gcloud_client():
    global _gcloud_client
    if _gcloud_client is None and _GCLOUD_AVAILABLE:
        _gcloud_client = gtts.TextToSpeechAsyncClient()
    return _gcloud_client


async def _synthesize_gcloud(text: str, level: str, language: str) -> bytes:
    if not _GCLOUD_AVAILABLE:
        raise RuntimeError("google-cloud-texttospeech not installed")

    client = _get_gcloud_client()
    if client is None:
        raise RuntimeError("Google Cloud TTS client unavailable")

    lang_code, voice_name = pick_gcloud_voice(level, language)

    # Chirp 3: HD voices accept plain text only — SSML is unsupported, so the
    # <lang> accent trick can't be used with them (they read embedded English
    # natively instead). The SSML path stays available for Neural2/WaveNet.
    is_chirp = "chirp" in voice_name.lower()

    # Vietnamese non-Chirp voice + text contains English → wrap English in SSML
    # <lang> tags so the English vocab/examples sound native, not Việt-accented.
    if language == "vi" and not is_chirp:
        ssml_body, has_english = _wrap_english_in_ssml(text)
        if has_english:
            synthesis_input = gtts.SynthesisInput(ssml=f"<speak>{ssml_body}</speak>")
        else:
            synthesis_input = gtts.SynthesisInput(text=text)
    else:
        synthesis_input = gtts.SynthesisInput(text=text)

    voice = gtts.VoiceSelectionParams(language_code=lang_code, name=voice_name)
    audio_config = gtts.AudioConfig(
        audio_encoding=gtts.AudioEncoding.MP3,
        speaking_rate=1.0,
        pitch=0.0,
        effects_profile_id=["headphone-class-device"],
    )

    response = await client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
    )
    return response.audio_content


# ── Public API ───────────────────────────────────────────────────────────────

async def synthesize_to_file(
    text: str,
    level: str,
    language: str,
    *,
    provider: str = "gcloud",
    credentials_path: str = "",
) -> str:
    """
    Synthesise `text` to an MP3 file in AUDIO_DIR. Returns the filename.

    Auto-falls back from gcloud -> edge if credentials missing or API errors out.
    """
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.mp3"
    path = AUDIO_DIR / filename

    if credentials_path and not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

    audio_bytes: bytes | None = None

    used_provider = "edge"

    if provider == "gcloud" and _GCLOUD_AVAILABLE and (
        credentials_path or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    ):
        try:
            audio_bytes = await _synthesize_gcloud(text, level, language)
            _, voice_name = pick_gcloud_voice(level, language)
            print(f"[TTS] Google Cloud OK — voice={voice_name} lang={language} level={level}")
            used_provider = "gcloud"
        except Exception as e:
            print(f"[TTS] gcloud FAILED, falling back to edge-tts: {e}")
            audio_bytes = None

    if audio_bytes is None:
        audio_bytes = await _synthesize_edge(text, level, language)
        edge_voice = pick_edge_voice(level, language)
        print(f"[TTS] edge-tts OK — voice={edge_voice} lang={language} level={level}")
        used_provider = "edge"

    await asyncio.to_thread(path.write_bytes, audio_bytes)
    print(f"[TTS] saved {filename} (provider={used_provider})")
    return filename


def is_gcloud_configured(credentials_path: str = "") -> bool:
    if not _GCLOUD_AVAILABLE:
        return False
    return bool(credentials_path or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))

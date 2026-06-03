"""
RAG Service - AI Listening Test Generator
POST /api/rag/listening/generate
  → Synthesize listening audio from a script (TTS) AND generate IELTS Listening
    questions from that transcript. Returns { audio_url, transcript, questions }.

Listening has its OWN prompt and its OWN question allocation, independent of the
reading generator:
  - The prompt is written for spoken audio (conversation/monologue) and never uses
    True/False/Not Given or Yes/No/Not Given (those are Reading-only types).
  - Allocation honors EVERY selected type (no >=4-per-block rule), so the author's
    type selection isn't silently dropped on small question counts.
Only the skill-neutral plumbing (JSON extraction, salvage, normalization, the
allocation formatter, the GeneratedQuestion model) is shared with reading_gen.
The TTS + storage services are the same ones that power the live classroom, so
listening audio is durable (uploaded to S3 when configured) like lesson narration.
"""

import json
import re
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings
from app.services.tts_service import AUDIO_DIR, synthesize_to_file
from app.services.storage import store_audio_and_url
from app.services.llm_service import generate_text
from app.routers.reading_gen import (
    GeneratedQuestion,
    _format_allocation,
    _normalize,
    _extract_json_array,
    _salvage_objects,
)

router = APIRouter(tags=["Listening Generator"])


# ── Request / Response ────────────────────────────────────────────────────────

class ListeningGenRequest(BaseModel):
    transcript: str = Field(..., min_length=30, description="Audio script to speak + build questions from")
    question_types: list[str] = Field(
        default=["MULTIPLE_CHOICE", "GAP_FILL", "SHORT_ANSWER", "MATCHING"],
        description="Question types to generate",
    )
    num_questions: int = Field(default=10, ge=1, le=40)
    difficulty: str = Field(default="intermediate", description="easy / intermediate / hard")
    language: str = Field(default="en", description="TTS language: 'en' | 'vi'")
    level: str = Field(default="intermediate", description="Voice level: beginner / intermediate / advanced")
    with_audio: bool = Field(
        default=True,
        description="Synthesize audio via TTS. Set false to only generate questions "
                    "from an existing transcript (audio already uploaded).",
    )


class ListeningGenResponse(BaseModel):
    success: bool = True
    audio_url: str = ""
    transcript: str = ""
    questions: list[GeneratedQuestion] = []
    summary: str = ""


# ── Listening question types & allocation ───────────────────────────────────────

# IELTS Listening question types only — no True/False/Not Given or Yes/No/Not Given
# (those exist only in Reading).
LISTENING_VALID_TYPES = {
    "MULTIPLE_CHOICE", "MULTIPLE_CHOICE_MULTI_ANSWER",
    "GAP_FILL", "SHORT_ANSWER", "MATCHING",
}


def _plan_listening_allocation(types: list[str], target: int) -> list[tuple[str, int]]:
    """Distribute `target` questions across EVERY selected Listening type as evenly
    as possible. Unlike Reading (which enforces >= MIN_PER_TYPE per block and drops
    types that don't fit), Listening HONORS the author's full selection — a learning
    set may legitimately mix small groups. Reading-only types (TFNG/YNG) and unknown
    values are filtered out.

    Example: target=10, types=[MC, GAP, MATCH, SHORT]
             -> [(MC,3),(GAP,3),(MATCH,2),(SHORT,2)]   (all four honored)
    """
    seen: set[str] = set()
    clean = [
        t for t in (types or [])
        if t in LISTENING_VALID_TYPES and not (t in seen or seen.add(t))
    ]
    if not clean:
        clean = ["MULTIPLE_CHOICE"]
    # Only when there are genuinely more types than questions do we trim — keep the
    # first `target` so every kept type still gets at least one question.
    if len(clean) > target:
        clean = clean[:target]
    k = len(clean)
    base, rem = divmod(target, k)
    return [(t, base + (1 if i < rem else 0)) for i, t in enumerate(clean)]


# ── Prompts ─────────────────────────────────────────────────────────────────────

LISTENING_GEN_PROMPT = """You are an expert IELTS exam question writer. Generate IELTS LISTENING questions from the transcript of a spoken audio recording (a conversation or a monologue).

**TRANSCRIPT (this is the spoken audio the student hears):**
{passage}

**REQUIREMENTS:**
- Generate exactly {num_questions} questions in total
- Difficulty level: {difficulty}
- Questions must be answerable from the transcript ONLY — test what is actually said
- These are LISTENING questions. Do NOT use True/False/Not Given or Yes/No/Not Given (those are Reading-only).
- EVERY question MUST have a complete, specific question written in "questionText" AND copied into content.text — e.g. "What is the woman's family name?", "Where does she want to stay?". NEVER leave questionText empty or write a generic placeholder like "Question 1". (The ONLY exception is GAP_FILL, where the gapped sentence in content.summaryText is the question.)
- Include a clear explanation for each answer
- For EVERY question, add an "evidence" field: copy VERBATIM (word-for-word, exact punctuation, no paraphrasing or translation) the shortest sentence from the transcript that proves the answer. This is the "answer location" shown in the review.

**EXACT QUESTION BREAKDOWN (follow this precisely):**
{allocation}

**CRITICAL — GROUP QUESTIONS BY TYPE (like a real IELTS Listening section):**
- Generate EXACTLY the number of questions specified per type above — no more, no fewer.
- Do NOT interleave question types. Output them in contiguous blocks, one type at a time, in the order listed above.
- The "questionOrder" field must run 1, 2, 3, ... in this grouped order.

**IMPORTANT: Return ONLY valid JSON (no markdown, no ```json, no extra text).**

Return a JSON array where each question follows this EXACT format based on its type:

For MULTIPLE_CHOICE:
{{
  "questionType": "MULTIPLE_CHOICE",
  "questionText": "Why is the woman calling?",
  "options": ["To book accommodation", "To cancel a booking", "To ask for directions", "To make a complaint"],
  "content": {{"text": "Why is the woman calling?", "options": ["To book accommodation", "To cancel a booking", "To ask for directions", "To make a complaint"]}},
  "answer": {{"correctIndex": 0}},
  "explanation": "She says she'd like to organise some short stay accommodation...",
  "evidence": "<exact sentence copied verbatim from the transcript that proves this answer>"
}}

For GAP_FILL (Form / Note / Table / Sentence Completion — the most common Listening task):
- Put the line to complete in "content.summaryText", with the blank written as {{{{1}}}} (double curly braces around the gap number). Do NOT write blanks as underscores or dots.
- Leave "questionText" EMPTY (""); the instruction goes in "content.instruction".
- "answer.gaps" maps each gap number to the exact word(s)/number spoken in the audio.
{{
  "questionType": "GAP_FILL",
  "questionText": "",
  "options": [],
  "content": {{"instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.", "summaryText": "Family name: {{{{1}}}}"}},
  "answer": {{"gaps": {{"1": ["McKinley"]}}}},
  "explanation": "The caller spells out her family name as M-C-K-I-N-L-A-Y.",
  "evidence": "<exact sentence copied verbatim from the transcript>"
}}

For SHORT_ANSWER:
{{
  "questionType": "SHORT_ANSWER",
  "questionText": "Where does the woman want the accommodation?",
  "options": [],
  "content": {{"text": "Where does the woman want the accommodation?"}},
  "answer": {{"text": ["Gold Coast"]}},
  "explanation": "She asks for accommodation on the Gold Coast.",
  "evidence": "<exact sentence copied verbatim from the transcript>"
}}

For MATCHING:
{{
  "questionType": "MATCHING",
  "questionText": "What does the speaker say about the location?",
  "options": ["It is close to the beach", "It is too expensive", "It is far from transport"],
  "content": {{"text": "What does the speaker say about the location?", "options": ["It is close to the beach", "It is too expensive", "It is far from transport"], "instruction": "Match the statement with the correct option A-C."}},
  "answer": {{"correctOption": "A"}},
  "explanation": "...",
  "evidence": "<exact sentence copied verbatim from the transcript>"
}}

Generate the questions now, following the EXACT QUESTION BREAKDOWN above. Group them by type in contiguous blocks (NOT interleaved). Return ONLY the JSON array."""


LISTENING_TOPUP_PROMPT = """You are an expert IELTS exam question writer. Generate {num_questions} MORE IELTS Listening questions from the transcript below.

**TRANSCRIPT:**
{passage}

**REQUIREMENTS:**
- Generate exactly {num_questions} NEW questions (do not repeat any existing ones)
- Difficulty level: {difficulty}
- Questions must be answerable from the transcript only
- Do NOT use True/False/Not Given or Yes/No/Not Given
- Follow the exact same JSON format and field names as standard IELTS Listening questions

**EXACT QUESTION BREAKDOWN (follow this precisely):**
{allocation}

**ALREADY GENERATED (do NOT duplicate these):**
{existing}

**IMPORTANT: Return ONLY a valid JSON array of the new questions (no markdown, no extra text)."""


# ── TTS helpers ────────────────────────────────────────────────────────────────

def _split_for_tts(text: str, max_len: int = 3500) -> list[str]:
    """Split a long script into chunks at sentence boundaries.

    Google Cloud TTS caps a single request at ~5000 bytes, so a full listening
    script must be synthesized in pieces and stitched together.
    """
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks: list[str] = []
    cur = ""
    for s in sentences:
        if cur and len(cur) + len(s) + 1 > max_len:
            chunks.append(cur)
            cur = s
        else:
            cur = f"{cur} {s}".strip() if cur else s
    if cur:
        chunks.append(cur)
    return chunks or [text[:max_len]]


async def _synthesize_script(text: str, level: str, language: str, settings) -> str:
    """Synthesize the (possibly long) script to one MP3 and return its served URL."""
    chunks = _split_for_tts(text, 3500)
    parts = []
    for chunk in chunks:
        try:
            fn = await synthesize_to_file(
                chunk, level, language,
                provider=settings.tts_provider,
                credentials_path=settings.google_application_credentials,
            )
            if fn:
                parts.append(AUDIO_DIR / fn)
        except Exception as e:
            print(f"[Listening Gen] TTS chunk failed: {e}")

    if not parts:
        return ""
    if len(parts) == 1:
        return await store_audio_and_url(parts[0], parts[0].name, settings.audio_base_url)

    # Concatenate the per-chunk MP3s into a single file (byte-append plays back
    # sequentially in browsers), then serve/upload that.
    final_name = f"listening_{uuid.uuid4().hex}.mp3"
    final_path = AUDIO_DIR / final_name
    with open(final_path, "wb") as out:
        for p in parts:
            try:
                out.write(p.read_bytes())
            except Exception:
                pass
    # Tidy up the intermediate chunk files (best-effort).
    for p in parts:
        try:
            p.unlink(missing_ok=True)
        except Exception:
            pass
    return await store_audio_and_url(final_path, final_name, settings.audio_base_url)


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/api/rag/listening/generate", response_model=ListeningGenResponse)
async def generate_listening(body: ListeningGenRequest):
    """Generate a listening test (audio + questions) from a script."""
    settings = get_settings()
    transcript = body.transcript.strip()
    lang = body.language if body.language in ("en", "vi") else "en"

    # 1) Synthesize the audio (independent of question generation — if TTS fails
    #    the teacher still gets questions and can attach audio manually). Skipped
    #    entirely when with_audio=False (questions-only from an existing transcript).
    audio_url = ""
    if body.with_audio:
        try:
            audio_url = await _synthesize_script(transcript[:8000], body.level, lang, settings)
        except Exception as e:
            print(f"[Listening Gen] TTS failed: {e}")

    # 2) Generate the questions from the transcript using the Listening-specific
    #    prompt and allocation (honors every selected type — no silent type drops).
    plan = _plan_listening_allocation(body.question_types, body.num_questions)
    plan_types = [t for t, _ in plan]
    want = {t: c for t, c in plan}
    allocation = _format_allocation(plan)
    print(f"[Listening Gen] Transcript length: {len(transcript)}, target: {body.num_questions}, plan: {plan}")

    async def _generate(prompt: str) -> list[GeneratedQuestion]:
        raw = await generate_text(prompt, settings, temperature=0.4, max_tokens=16384, timeout=300)
        try:
            raw_list = _extract_json_array(raw)
        except json.JSONDecodeError:
            raw_list = _salvage_objects(raw)  # recover from truncated output
        # _normalize backfills empty stems from content.text and canonicalizes GAP_FILL.
        return _normalize(raw_list, transcript)

    # Bucket per planned type (cap each block at its planned count). Extra valid
    # questions of a selected type go to `spare` — when a type under-delivers (e.g.
    # MC reclassified to SHORT_ANSWER for missing options), we backfill the total
    # from spare so the author still gets close to the requested count.
    buckets: dict[str, list[GeneratedQuestion]] = {t: [] for t in plan_types}
    spare: list[GeneratedQuestion] = []

    def _absorb(items: list[GeneratedQuestion]) -> None:
        for q in items:
            b = buckets.get(q.questionType)
            if b is None:
                continue  # type not in the author's selection
            if len(b) < want[q.questionType]:
                b.append(q)
            else:
                spare.append(q)  # overflow — used later to hit the target total

    try:
        _absorb(await _generate(LISTENING_GEN_PROMPT.format(
            passage=transcript[:6000],
            num_questions=body.num_questions,
            allocation=allocation,
            difficulty=body.difficulty,
        )))

        # Top up until we reach the requested count (counting overflow `spare`).
        # Pass 0 targets the exact per-type deficit; later passes bias the fill
        # toward the types the model actually produces, so a type it struggles with
        # (often MULTIPLE_CHOICE) doesn't starve the total — we'd rather ship 10
        # questions with a shifted mix than 8 with the "right" ratio.
        MAX_TOPUP = 3
        for attempt in range(MAX_TOPUP):
            have = sum(len(b) for b in buckets.values()) + len(spare)
            if have >= body.num_questions:
                break
            remaining = body.num_questions - have
            deficits = [(t, want[t] - len(buckets[t])) for t in plan_types if len(buckets[t]) < want[t]]
            if attempt == 0 and deficits:
                fill_alloc = deficits
            else:
                prod = sorted(
                    plan_types,
                    key=lambda t: len(buckets[t]) + sum(1 for s in spare if s.questionType == t),
                    reverse=True,
                )
                fill_types = prod[:max(1, remaining)]
                base, rem = divmod(remaining, len(fill_types))
                fill_alloc = [(t, base + (1 if i < rem else 0)) for i, t in enumerate(fill_types)]
                fill_alloc = [(t, c) for t, c in fill_alloc if c > 0]
            existing = "\n".join(
                f"- {q.questionText or (q.content or {}).get('summaryText', '')}"
                for q in [*(qq for t in plan_types for qq in buckets[t]), *spare]
            )[:3000]
            _absorb(await _generate(LISTENING_TOPUP_PROMPT.format(
                passage=transcript[:6000],
                num_questions=sum(c for _, c in fill_alloc),
                allocation=_format_allocation(fill_alloc),
                difficulty=body.difficulty,
                existing=existing,
            )))
    except Exception as e:
        print(f"[Listening Gen] Question generation failed: {e}")

    # Assemble grouped by planned type. If some type fell short, fill the remaining
    # slots from the overflow `spare` so we get as close to num_questions as we can.
    questions: list[GeneratedQuestion] = []
    for t in plan_types:
        questions.extend(buckets[t])
    if len(questions) < body.num_questions and spare:
        questions.extend(spare[: body.num_questions - len(questions)])
        # keep the display grouped by type (stable sort preserves arrival order)
        questions.sort(key=lambda q: plan_types.index(q.questionType) if q.questionType in plan_types else len(plan_types))
    for i, q in enumerate(questions):
        q.questionOrder = i + 1

    counts: dict[str, int] = {}
    for q in questions:
        counts[q.questionType] = counts.get(q.questionType, 0) + 1
    types_summary = ", ".join(f"{t}×{c}" for t, c in counts.items())
    print(f"[Listening Gen] Generated {len(questions)} questions ({types_summary})")

    if not audio_url and not questions:
        raise HTTPException(502, "Could not generate listening audio or questions. Please try again.")

    return ListeningGenResponse(
        success=True,
        audio_url=audio_url,
        transcript=transcript,
        questions=questions,
        summary=f"Generated {len(questions)} listening questions ({types_summary})"
                + ("" if audio_url or not body.with_audio else " — audio synthesis unavailable, attach audio manually."),
    )

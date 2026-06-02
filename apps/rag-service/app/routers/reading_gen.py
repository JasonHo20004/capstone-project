"""
RAG Service - AI Reading Question Generator
POST /api/rag/reading/generate → Generate IELTS Reading questions from a passage
"""

import json
import re
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.config import get_settings

router = APIRouter(tags=["Reading Generator"])


# ── Request / Response ────────────────────────────────────────────────────────

class ReadingGenRequest(BaseModel):
    passage: str = Field(..., min_length=50, description="Reading passage text")
    question_types: list[str] = Field(
        default=["MULTIPLE_CHOICE", "TRUE_FALSE_NOT_GIVEN", "GAP_FILL", "MATCHING"],
        description="Question types to generate"
    )
    num_questions: int = Field(default=10, ge=1, le=40, description="Number of questions")
    difficulty: str = Field(default="intermediate", description="easy / intermediate / hard")


class GeneratedQuestion(BaseModel):
    questionText: str
    questionType: str
    options: list[str] = []
    content: dict = {}
    answer: dict = {}
    explanation: str = ""
    questionOrder: int = 0
    # Study4-style answer location: the exact passage sentence justifying the
    # answer, snapped verbatim to the passage so the review UI can highlight it.
    answerReference: dict = {}


class ReadingGenResponse(BaseModel):
    success: bool = True
    questions: list[GeneratedQuestion] = []
    summary: str = ""


# ── Prompt ────────────────────────────────────────────────────────────────────

READING_GEN_PROMPT = """You are an expert IELTS exam question writer. Generate IELTS Reading questions from the given passage.

**PASSAGE:**
{passage}

**REQUIREMENTS:**
- Generate exactly {num_questions} questions in total
- Difficulty level: {difficulty}
- Questions must be answerable from the passage only
- Include clear explanations for each answer
- For EVERY question, add an "evidence" field: copy VERBATIM (word-for-word, exact punctuation, no paraphrasing or translation) the shortest sentence from the passage that proves the answer. This is the "answer location" shown in the review. For TRUE_FALSE/YES_NO answered NOT GIVEN, use "evidence": "".

**EXACT QUESTION BREAKDOWN (follow this precisely):**
{allocation}

**CRITICAL — GROUP QUESTIONS BY TYPE (like a real IELTS exam):**
- Generate EXACTLY the number of questions specified per type above — no more, no fewer.
- Do NOT interleave question types. Output them in contiguous blocks, one type at a time, in the order listed above.
- Finish ALL questions of the first type, then ALL of the next type, and so on.
- The "questionOrder" field must run 1, 2, 3, ... in this grouped order.

**IMPORTANT: Return ONLY valid JSON (no markdown, no ```json, no extra text).**

Return a JSON array where each question follows this EXACT format based on its type:

For MULTIPLE_CHOICE:
{{
  "questionType": "MULTIPLE_CHOICE",
  "questionText": "What does the author suggest about...?",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "content": {{"text": "What does the author suggest about...?", "options": ["Option A text", "Option B text", "Option C text", "Option D text"]}},
  "answer": {{"correctIndex": 0}},
  "explanation": "The answer is A because the passage states...",
  "evidence": "<exact sentence copied verbatim from the passage that proves this answer>"
}}

For TRUE_FALSE_NOT_GIVEN:
{{
  "questionType": "TRUE_FALSE_NOT_GIVEN",
  "questionText": "The statement about...",
  "options": [],
  "content": {{"text": "The statement about..."}},
  "answer": {{"correctAnswer": "TRUE"}},
  "explanation": "This is TRUE because paragraph 2 says...",
  "evidence": "<exact sentence copied verbatim from the passage; use \"\" if NOT GIVEN>"
}}

For YES_NO_NOT_GIVEN:
{{
  "questionType": "YES_NO_NOT_GIVEN",
  "questionText": "The writer believes that...",
  "options": [],
  "content": {{"text": "The writer believes that..."}},
  "answer": {{"correctAnswer": "YES"}},
  "explanation": "The writer agrees because..."
}}

For GAP_FILL (Summary/Sentence Completion):
- Put the sentence to complete in "content.summaryText", with the blank written as the marker {{{{1}}}} (double curly braces around the gap number). Do NOT write blanks as underscores or dots.
- Leave "questionText" EMPTY ("") — do NOT repeat "Complete the summary below" in it; the instruction goes in "content.instruction".
- "answer.gaps" maps each gap number to the correct word(s).
{{
  "questionType": "GAP_FILL",
  "questionText": "",
  "options": [],
  "content": {{"instruction": "Choose NO MORE THAN TWO WORDS from the passage for each answer.", "summaryText": "The research found that {{{{1}}}} was the main factor in polar bears' survival."}},
  "answer": {{"gaps": {{"1": ["correct_word"]}}}},
  "explanation": "Gap 1: The passage states 'correct_word was the main factor'..."
}}

For MATCHING:
{{
  "questionType": "MATCHING",
  "questionText": "Which paragraph mentions...?",
  "options": ["The importance of education", "Economic growth factors", "Environmental concerns"],
  "content": {{"text": "Which paragraph mentions...?", "options": ["The importance of education", "Economic growth factors", "Environmental concerns"], "instruction": "Match each statement with the correct paragraph."}},
  "answer": {{"correctOption": "A"}},
  "explanation": "The answer is A because..."
}}

For SHORT_ANSWER:
{{
  "questionType": "SHORT_ANSWER",
  "questionText": "What type of research was conducted in 2015?",
  "options": [],
  "content": {{"text": "What type of research was conducted in 2015?"}},
  "answer": {{"text": ["survey"]}},
  "explanation": "According to paragraph 3, a survey was conducted..."
}}

Generate the questions now, following the EXACT QUESTION BREAKDOWN above. Group them by type in contiguous blocks (NOT interleaved). Return ONLY the JSON array."""


# Asks the LLM for only the missing questions when the first pass falls short.
TOPUP_PROMPT = """You are an expert IELTS exam question writer. Generate {num_questions} MORE IELTS Reading questions from the passage below.

**PASSAGE:**
{passage}

**REQUIREMENTS:**
- Generate exactly {num_questions} NEW questions (do not repeat any existing ones)
- Difficulty level: {difficulty}
- Questions must be answerable from the passage only
- Follow the exact same JSON format and field names as standard IELTS Reading questions

**EXACT QUESTION BREAKDOWN (follow this precisely):**
{allocation}

**ALREADY GENERATED (do NOT duplicate these):**
{existing}

**IMPORTANT: Return ONLY a valid JSON array of the new questions (no markdown, no extra text).**"""


VALID_TYPES = {
    "MULTIPLE_CHOICE", "TRUE_FALSE_NOT_GIVEN", "YES_NO_NOT_GIVEN",
    "GAP_FILL", "MATCHING", "SHORT_ANSWER", "MULTIPLE_CHOICE_MULTI_ANSWER",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

MIN_PER_TYPE = 4  # a question type must have at least this many to form a block


def _plan_allocation(types: list[str], target: int, min_per_type: int = MIN_PER_TYPE) -> list[tuple[str, int]]:
    """Decide how many questions each type gets so every used type forms a real
    block (>= min_per_type). With `target` questions we can afford at most
    target // min_per_type distinct types; the rest of the requested types are
    dropped. Questions are split as evenly as possible across the kept types.

    Example: target=14, types=[MC, GAP, MATCH, TFNG] -> [(MC,5),(GAP,5),(MATCH,4)]
    (4 types won't fit since 4*4=16 > 14, so the last type is dropped).
    """
    clean = [t for t in (types or []) if t in VALID_TYPES] or ["MULTIPLE_CHOICE"]
    max_types = max(1, target // min_per_type)
    used = clean[:max_types]
    k = len(used)
    base, rem = divmod(target, k)
    return [(t, base + (1 if i < rem else 0)) for i, t in enumerate(used)]


def _format_allocation(plan: list[tuple[str, int]]) -> str:
    """Human-readable per-type breakdown for the prompt."""
    return "\n".join(f"- {count} questions of type {t}" for t, count in plan)


def _call_ollama(prompt: str, settings) -> str:
    """Call Ollama /api/generate and return the raw text response."""
    url = f"{settings.ollama_base_url}/api/generate"
    try:
        resp = requests.post(
            url,
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                # Large output budget: 14+ questions with options/content/
                # explanations easily exceeds 8k tokens and gets truncated.
                "options": {"temperature": 0.4, "num_predict": 16384},
            },
            timeout=600,  # LLM may take time for many questions
        )
    except requests.exceptions.ConnectionError as e:
        print(f"[Reading Gen] Connection error: {e}")
        raise HTTPException(503, "AI service unavailable. Check Colab tunnel.")

    if resp.status_code != 200:
        print(f"[Reading Gen] Ollama error {resp.status_code}: {resp.text[:500]}")
        raise HTTPException(502, f"Ollama error: {resp.status_code}")

    return resp.json().get("response", "").strip()


def _extract_json_array(raw: str):
    """Pull a JSON array out of an LLM response (handles markdown fences)."""
    json_str = raw
    if "```json" in json_str:
        json_str = json_str.split("```json")[1].split("```")[0].strip()
    elif "```" in json_str:
        json_str = json_str.split("```")[1].split("```")[0].strip()

    start = json_str.find("[")
    end = json_str.rfind("]")
    if start != -1 and end != -1:
        json_str = json_str[start : end + 1]

    return json.loads(json_str)


def _salvage_objects(raw: str) -> list:
    """Recover as many complete JSON objects as possible from a (possibly
    truncated) LLM array response. The model often hits the token limit
    mid-array, leaving the JSON unclosed — we keep every question that did
    finish and discard the half-written tail."""
    s = raw
    if "```json" in s:
        s = s.split("```json", 1)[1]
    elif "```" in s:
        s = s.split("```", 1)[1]
    start = s.find("[")
    if start != -1:
        s = s[start + 1:]

    decoder = json.JSONDecoder()
    objs: list = []
    i, n = 0, len(s)
    while i < n:
        while i < n and s[i] in " \t\r\n,":
            i += 1
        if i >= n or s[i] == "]":
            break
        try:
            obj, end = decoder.raw_decode(s, i)
        except json.JSONDecodeError:
            break  # remaining text is the truncated/incomplete tail
        objs.append(obj)
        i = end
    return objs


_GAP_RE = re.compile(r"\{\{\s*(\d+)\s*\}\}")
_DEFAULT_GAP_INSTRUCTION = "Choose NO MORE THAN TWO WORDS from the passage for each answer."


def _ensure_gap_markers(text: str) -> str:
    """Guarantee the summary uses {{1}}, {{2}}... gap markers. Local models often
    write blanks as underscores or dots instead — convert those in order."""
    if _GAP_RE.search(text):
        return text
    counter = [0]

    def repl(_m):
        counter[0] += 1
        return f"{{{{{counter[0]}}}}}"

    # 2+ underscores or 3+ dots / ellipsis are treated as a blank.
    return re.sub(r"_{2,}|\.{3,}|…+", repl, text)


def _canonicalize_gap_fill(q: dict) -> dict:
    """Reshape a GAP_FILL question into the format the frontend expects:
    content.summaryText with {{N}} markers + answer.gaps keyed by gap number.
    Local models frequently dump the gapped sentence (and the instruction) into
    questionText and leave summaryText/gaps empty, which makes the UI show a raw
    "{{1}}" and a generic input instead of an inline blank. We repair that here."""
    content = dict(q.get("content") or {})
    qtext = (q.get("questionText") or "").strip()
    summary = (content.get("summaryText") or "").strip()

    # Find the gapped sentence wherever the model put it.
    candidate = summary or (content.get("text") or "").strip() or qtext
    candidate = _ensure_gap_markers(candidate)

    # Drop a leading boilerplate instruction the model sometimes prepends to the
    # sentence (e.g. "Complete the summary below The research found that ...").
    # Non-greedy up to the first "below" so we never eat the real sentence, and
    # we refuse to strip if doing so would remove the gap marker(s).
    stripped = re.sub(
        r"^\s*complete the (?:summary|sentences?|notes?|table|flow[- ]?chart)\b.*?\bbelow\b[\s:.,\-]*",
        "",
        candidate,
        flags=re.I,
    ).strip()
    if _GAP_RE.search(stripped) or not _GAP_RE.search(candidate):
        candidate = stripped

    # Last resort: if there is still no blank, append one so the UI renders an input.
    if not _GAP_RE.search(candidate):
        candidate = candidate.rstrip(". ") + " {{1}}."

    content["summaryText"] = candidate
    content.setdefault("instruction", _DEFAULT_GAP_INSTRUCTION)
    content["text"] = ""  # keep questionText empty so the instruction isn't repeated per question

    # Normalize the answer into {"gaps": {"1": [...], ...}}.
    answer = q.get("answer") or {}
    gaps: dict[str, list] = {}
    raw_gaps = answer.get("gaps") if isinstance(answer, dict) else None
    if isinstance(raw_gaps, dict) and raw_gaps:
        for k, v in raw_gaps.items():
            gaps[str(k)] = v if isinstance(v, list) else [v]
    else:
        # Fall back to flat answer shapes (text / answers / correctAnswer).
        vals = None
        if isinstance(answer, dict):
            vals = answer.get("text") or answer.get("answers") or answer.get("answer") or answer.get("correctAnswer")
        if isinstance(vals, str):
            vals = [vals]
        nums = _GAP_RE.findall(candidate)
        if isinstance(vals, list):
            for idx, num in enumerate(nums):
                gaps[num] = [vals[idx]] if idx < len(vals) else [""]

    # Make sure every gap number in the summary has an answer slot.
    for num in _GAP_RE.findall(candidate):
        gaps.setdefault(num, [""])

    new_q = dict(q)
    new_q["questionType"] = "GAP_FILL"
    new_q["questionText"] = ""
    new_q["content"] = content
    new_q["answer"] = {"gaps": gaps}
    return new_q


def _coerce_answer(qt: str, answer) -> dict:
    """Local models sometimes return `answer` as a bare string/number/list
    instead of the expected object. Wrap it into the dict shape the frontend
    reads for that question type so Pydantic validation doesn't blow up."""
    if isinstance(answer, dict):
        return answer
    if qt in ("TRUE_FALSE_NOT_GIVEN", "YES_NO_NOT_GIVEN"):
        return {"correctAnswer": str(answer).strip().upper()}
    if qt == "MATCHING":
        return {"correctOption": str(answer).strip()}
    if qt in ("MULTIPLE_CHOICE", "MULTIPLE_CHOICE_MULTI_ANSWER"):
        if isinstance(answer, bool):
            return {"correctIndex": 0}
        if isinstance(answer, int):
            return {"correctIndex": answer}
        if isinstance(answer, str) and answer.strip().isdigit():
            return {"correctIndex": int(answer.strip())}
        return {"text": [str(answer)]}
    # SHORT_ANSWER, GAP_FILL fallbacks, anything else
    if isinstance(answer, list):
        return {"text": [str(v) for v in answer]}
    return {"text": [str(answer)]}


def _locate_in_passage(passage: str, snippet: str):
    """(start, end) offsets of snippet in passage, tolerant of whitespace/case; (None, None) if absent."""
    if not snippet:
        return None, None
    idx = passage.find(snippet)
    if idx >= 0:
        return idx, idx + len(snippet)
    # Whitespace/case-flexible match. NOTE: re.escape() escapes spaces on Python
    # 3.7+, so escape each non-space token and rejoin with \s+ instead of running
    # re.sub over the escaped string (which would break the pattern).
    tokens = snippet.split()
    if not tokens:
        return None, None
    pattern = r"\s+".join(re.escape(tok) for tok in tokens)
    m = re.search(pattern, passage, re.IGNORECASE)
    if m:
        return m.start(), m.end()
    return None, None


def _build_answer_reference(passage: str, evidence) -> dict:
    """Snap the AI's evidence sentence to an exact passage span so the review UI
    highlights the precise answer location (Study4-style). Falls back to the raw
    text (client fuzzy-highlights) when it can't be anchored verbatim."""
    if not isinstance(evidence, str):
        evidence = "" if evidence is None else str(evidence)
    evidence = evidence.strip()
    if not passage or not evidence:
        return {}
    start, end = _locate_in_passage(passage, evidence)
    if start is not None:
        return {"snippet": passage[start:end], "start": start, "end": end, "source": "ai"}
    return {"snippet": evidence, "source": "ai"}


def _normalize(questions_raw: list, passage: str = "") -> list[GeneratedQuestion]:
    """Validate + coerce raw LLM dicts into GeneratedQuestion objects."""
    out: list[GeneratedQuestion] = []
    for i, q in enumerate(questions_raw):
        if not isinstance(q, dict):
            continue
        qt = q.get("questionType", "MULTIPLE_CHOICE")
        if qt not in VALID_TYPES:
            qt = "MULTIPLE_CHOICE"
        evidence = q.get("evidence", "")
        if qt == "GAP_FILL":
            q = _canonicalize_gap_fill(q)

        content = q.get("content", {})
        if not isinstance(content, dict):
            content = {}
        options = q.get("options", [])
        if not isinstance(options, list):
            options = []
        explanation = q.get("explanation", "")
        if not isinstance(explanation, str):
            explanation = str(explanation)

        out.append(GeneratedQuestion(
            questionText=str(q.get("questionText", f"Question {i+1}")),
            questionType=qt,
            options=options,
            content=content,
            answer=_coerce_answer(qt, q.get("answer", {})),
            explanation=explanation,
            questionOrder=i + 1,
            answerReference=_build_answer_reference(passage, evidence),
        ))
    return out


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/api/rag/reading/generate", response_model=ReadingGenResponse)
async def generate_reading_questions(body: ReadingGenRequest):
    """Generate IELTS Reading questions from a passage using Ollama LLM."""
    settings = get_settings()

    target = body.num_questions
    # Allocate the questions across types so every used type forms a real block
    # (>= MIN_PER_TYPE). This drops types that can't fit and avoids lone
    # 1-question "blocks" like a single MATCHING question.
    plan = _plan_allocation(body.question_types, target)
    plan_types = [t for t, _ in plan]
    want = {t: c for t, c in plan}
    allocation = _format_allocation(plan)

    print(f"[Reading Gen] Calling Ollama at: {settings.ollama_base_url}/api/generate")
    print(f"[Reading Gen] Passage length: {len(body.passage)}, target: {target}, plan: {plan}")

    prompt = READING_GEN_PROMPT.format(
        passage=body.passage[:6000],
        num_questions=target,
        allocation=allocation,
        difficulty=body.difficulty,
    )

    raw = _call_ollama(prompt, settings)
    print(f"[Reading Gen] Raw response length: {len(raw)}")

    try:
        questions_raw = _extract_json_array(raw)
    except json.JSONDecodeError as e:
        # Output was almost certainly truncated at the token limit. Salvage the
        # complete questions and let the top-up loop below fill the rest.
        print(f"[Reading Gen] JSON parse error: {e} — attempting salvage")
        questions_raw = _salvage_objects(raw)
        if questions_raw:
            print(f"[Reading Gen] Salvaged {len(questions_raw)} complete questions from truncated output")
        else:
            print(f"[Reading Gen] Raw output: {raw[:1000]}")
            raise HTTPException(
                422,
                f"AI generated invalid JSON. Please try again. Error: {str(e)[:200]}"
            )

    if not isinstance(questions_raw, list):
        raise HTTPException(422, "AI did not return a question array. Retry.")

    # Bucket questions per planned type, capping each block at its planned count.
    buckets: dict[str, list[GeneratedQuestion]] = {t: [] for t in plan_types}

    def _absorb(items: list[GeneratedQuestion]) -> None:
        for q in items:
            b = buckets.get(q.questionType)
            if b is not None and len(b) < want[q.questionType]:
                b.append(q)

    _absorb(_normalize(questions_raw, body.passage))

    # Top up per-type deficits, asking only for the types that came up short so
    # each block reaches its planned size.
    MAX_TOPUP_ATTEMPTS = 2
    for attempt in range(1, MAX_TOPUP_ATTEMPTS + 1):
        deficits = [(t, want[t] - len(buckets[t])) for t in plan_types if len(buckets[t]) < want[t]]
        if not deficits:
            break
        missing_total = sum(d for _, d in deficits)
        existing = "\n".join(f"- {q.questionText}" for t in plan_types for q in buckets[t])[:3000]
        print(f"[Reading Gen] Short on {deficits} — top-up attempt {attempt}/{MAX_TOPUP_ATTEMPTS}")
        topup_prompt = TOPUP_PROMPT.format(
            passage=body.passage[:6000],
            num_questions=missing_total,
            allocation=_format_allocation(deficits),
            difficulty=body.difficulty,
            existing=existing,
        )
        topup_text = _call_ollama(topup_prompt, settings)
        try:
            extra_raw = _extract_json_array(topup_text)
        except json.JSONDecodeError:
            extra_raw = _salvage_objects(topup_text)
        if not isinstance(extra_raw, list) or not extra_raw:
            print("[Reading Gen] Top-up returned nothing usable — stopping top-up.")
            break
        _absorb(_normalize(extra_raw, body.passage))

    # Assemble in planned type order. Drop any block that still can't reach the
    # minimum when there are multiple types — better to omit a type than ship a
    # lone 1-question "block". With a single type, keep whatever we have.
    multi = len(plan_types) > 1
    questions: list[GeneratedQuestion] = []
    for t in plan_types:
        block = buckets[t]
        if multi and len(block) < MIN_PER_TYPE:
            print(f"[Reading Gen] Dropping type {t}: only {len(block)} question(s), needs >= {MIN_PER_TYPE}")
            continue
        questions.extend(block)

    if not questions:
        raise HTTPException(422, "AI could not produce a complete question block. Please try again.")

    # Re-number after grouping so questionOrder runs 1, 2, 3, ... top to bottom.
    for i, q in enumerate(questions):
        q.questionOrder = i + 1

    kept = [t for t in plan_types if (not multi or len(buckets[t]) >= MIN_PER_TYPE) and buckets[t]]
    types_summary = ", ".join(f"{t}×{len(buckets[t])}" for t in kept)
    if len(questions) < target:
        print(f"[Reading Gen] WARNING: returning {len(questions)}/{target} questions")
    print(f"[Reading Gen] Generated {len(questions)} questions ({types_summary})")

    return ReadingGenResponse(
        success=True,
        questions=questions,
        summary=f"Generated {len(questions)} IELTS Reading questions ({types_summary})"
    )

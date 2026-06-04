"""
RAG Service - Dictation Split / Clean Pipeline

Ported verbatim from the original Kaggle `whisper-timestamp-generator` notebook
(Step 3). Takes raw Whisper segments (with word-level timestamps) and produces
clean, short dictation sentences ready for the assessment-service.

Pipeline stages:
  3a. Split each segment into short chunks (by word count / pause / sentence end)
  3b. Drop Whisper hallucinations (pass 1)
  3c. Skip intro by count/time
  3d. Remove narrator instructions (IELTS "look at questions 1-5", etc.)
  3e. Remove the duplicated example-intro replay
  3f. Merge very short fragments into the previous sentence
  3g. Repair bad split boundaries created by the merge
  3h. Drop hallucinations again (pass 2)
  3i. Re-index

Input segments may be dicts or objects (TSegment/TWord) — `get_value` handles
both, so the exact same code works for faster-whisper output and JSON dicts.
"""

from __future__ import annotations

import re

# ── Config ─────────────────────────────────────────────────────────────────────
MAX_WORDS_PER_SENTENCE = 10        # soft limit: prefer to cut around here
HARD_MAX_WORDS_PER_SENTENCE = 14   # hard limit: force a cut beyond this
MAX_SECONDS_PER_SENTENCE = 4.5
PAUSE_SPLIT_SECONDS = 0.75
MIN_WORDS_PER_SENTENCE = 3

SENTENCE_END = re.compile(r'[.!?…]["”\')\]]?$')

NON_LATIN = re.compile(
    r'[一-鿿　-〿＀-￯'
    r'぀-ゟ゠-ヿ가-힯]'
)

INSTRUCTION_KEYWORDS = [
    "questions", "look at", "you will hear", "listen carefully",
    "now turn to", "that is the end", "before you hear",
    "you have some time", "now listen", "section",
    "part one", "part two", "part three", "part four",
    "example", "answer the questions", "read the questions",
    "first you have", "complete the", "choose the correct",
    "write no more than", "label the",
    "has been written", "now we shall begin", "we shall begin",
    "the answer is", "so the answer", "you can see",
    "in the space", "on the form", "on your answer sheet",
    "end of section", "end of part",
]

BAD_END_WORDS = {
    "of", "to", "for", "and", "or", "the", "a", "an",
    "in", "on", "at", "with", "by", "from",
    "my", "your", "our", "their",
    "short", "family", "first", "last",
    "get", "move", "coming", "arriving",
    "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "can", "could",
    "should", "shall", "may", "might", "must",
    "not", "no", "so", "because", "although",
}

BAD_START_WORDS = {
    "please", "for", "you", "then", "too", "there",
    "anyway", "actually", "fine", "july", "paradise",
    "accommodation", "stay",
}


# ── Helpers ──────────────────────────────────────────────────────────────────────
def get_value(obj, key, default=None):
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def normalize_word(w):
    return str(w).lower().strip().strip(".,!?;:\"'“”‘’()[]")


def clean_join_words(words):
    text = " ".join(str(w).strip() for w in words if str(w).strip())
    # short -stay -> short-stay, old -fashioned -> old-fashioned
    text = re.sub(r"\s+-\s*", "-", text)
    # M -A -C -> M-A-C
    text = re.sub(r"\b([A-Z])\s*-\s*([A-Z])\b", r"\1-\2", text)
    # punctuation spacing
    text = re.sub(r"\s+([,.!?;:%])", r"\1", text)
    # normalize spaces
    text = re.sub(r"\s+", " ", text).strip()
    return text


def is_bad_split_boundary(current_word, next_word=None):
    current_raw = str(current_word).strip()
    next_raw = str(next_word or "").strip()

    current = normalize_word(current_raw)
    next_clean = normalize_word(next_raw)

    if current in BAD_END_WORDS:
        return True
    if next_raw.startswith("-"):
        return True
    if next_clean in BAD_START_WORDS:
        return True
    if current_raw.endswith(","):
        return True
    return False


def is_hallucination_sentence(s):
    text = s["text"].strip()
    duration = s["endTime"] - s["startTime"]
    words = text.split()

    has_non_latin = bool(NON_LATIN.search(text))
    is_too_short_for_text = duration < 0.5 and len(words) > 3
    is_tiny = duration < 0.25
    is_zero_time = round(s["startTime"], 1) == round(s["endTime"], 1)
    is_repetitive = len(words) >= 6 and len(set(w.lower().strip(".,!?") for w in words)) <= 2

    return has_non_latin or is_too_short_for_text or is_tiny or is_zero_time or is_repetitive


def fallback_split_segment(seg):
    """Fallback when a segment has no word timestamps — timestamps are split
    proportionally, less accurate than word-level splitting."""
    text = str(get_value(seg, "text", "")).strip()
    words = text.split()
    if not words:
        return []

    start = float(get_value(seg, "start", 0))
    end = float(get_value(seg, "end", start))
    duration = max(end - start, 0.01)

    chunks = []
    current_words = []
    current_start_index = 0

    for i, word in enumerate(words):
        current_words.append(word)
        next_word = words[i + 1] if i + 1 < len(words) else ""
        word_count = len(current_words)
        ends_sentence = bool(SENTENCE_END.search(word))

        soft_split = word_count >= MAX_WORDS_PER_SENTENCE or ends_sentence
        hard_split = word_count >= HARD_MAX_WORDS_PER_SENTENCE
        bad_boundary = is_bad_split_boundary(word, next_word)

        if hard_split or (soft_split and not bad_boundary):
            chunk_start = start + duration * (current_start_index / len(words))
            chunk_end = start + duration * ((i + 1) / len(words))
            chunks.append({
                "text": clean_join_words(current_words),
                "startTime": round(chunk_start, 2),
                "endTime": round(chunk_end, 2),
            })
            current_words = []
            current_start_index = i + 1

    if current_words:
        chunk_start = start + duration * (current_start_index / len(words))
        chunks.append({
            "text": clean_join_words(current_words),
            "startTime": round(chunk_start, 2),
            "endTime": round(end, 2),
        })

    return chunks


def split_segment_by_words(seg):
    words = get_value(seg, "words", [])
    if not words:
        return fallback_split_segment(seg)

    chunks = []
    buffer = []
    last_end = None

    def flush():
        nonlocal buffer
        if not buffer:
            return
        chunk_words = [x["word"] for x in buffer]
        text = clean_join_words(chunk_words)
        if text:
            chunks.append({
                "text": text,
                "startTime": round(buffer[0]["start"], 2),
                "endTime": round(buffer[-1]["end"], 2),
            })
        buffer = []

    for idx, w in enumerate(words):
        word = str(get_value(w, "word", "")).strip()
        start = get_value(w, "start")
        end = get_value(w, "end")

        if not word or start is None or end is None:
            continue

        start = float(start)
        end = float(end)

        next_word = ""
        if idx + 1 < len(words):
            next_word = str(get_value(words[idx + 1], "word", "")).strip()

        # Split on a long pause before the current word
        if buffer and last_end is not None:
            pause = start - last_end
            if pause >= PAUSE_SPLIT_SECONDS and len(buffer) >= MIN_WORDS_PER_SENTENCE:
                prev_word = buffer[-1]["word"]
                if not is_bad_split_boundary(prev_word, word):
                    flush()

        buffer.append({"word": word, "start": start, "end": end})

        chunk_duration = buffer[-1]["end"] - buffer[0]["start"]
        word_count = len(buffer)
        ends_sentence = bool(SENTENCE_END.search(word))

        soft_split = (
            word_count >= MAX_WORDS_PER_SENTENCE
            or (chunk_duration >= MAX_SECONDS_PER_SENTENCE and word_count >= MIN_WORDS_PER_SENTENCE)
            or (ends_sentence and word_count >= MIN_WORDS_PER_SENTENCE)
        )
        hard_split = word_count >= HARD_MAX_WORDS_PER_SENTENCE
        bad_boundary = is_bad_split_boundary(word, next_word)

        if hard_split:
            flush()
        elif soft_split and not bad_boundary:
            flush()

        last_end = end

    flush()
    return chunks


# ── Main entry point ─────────────────────────────────────────────────────────────
def build_sentences(segments, skip_before_seconds: float = 0, skip_first_n: int = 0):
    """Run the full split/clean pipeline over raw Whisper segments.

    Returns (sentences, report) where sentences is a list of
    {index, text, startTime, endTime} and report is a stats dict.
    """
    # 3a. Extract short chunks
    sentences = []
    for seg in segments:
        for chunk in split_segment_by_words(seg):
            text = chunk["text"].strip()
            if text:
                sentences.append({
                    "index": len(sentences),
                    "text": text,
                    "startTime": chunk["startTime"],
                    "endTime": chunk["endTime"],
                })

    total_raw = len(sentences)

    # 3b. Remove hallucinations (pass 1)
    hallucination_count = 0
    clean = []
    for s in sentences:
        if is_hallucination_sentence(s):
            hallucination_count += 1
        else:
            clean.append(s)
    sentences = clean

    # 3c. Skip intro by count/time
    skipped_intro = 0
    if skip_first_n > 0:
        skipped_intro += min(skip_first_n, len(sentences))
        sentences = sentences[skip_first_n:]
    if skip_before_seconds > 0:
        before_skip = len(sentences)
        sentences = [s for s in sentences if s["startTime"] >= skip_before_seconds]
        skipped_intro += before_skip - len(sentences)

    # 3d. Auto-remove narrator instructions
    removed_instructions = []
    clean = []
    for s in sentences:
        text_lower = s["text"].lower()
        matched = [kw for kw in INSTRUCTION_KEYWORDS if kw in text_lower]
        if matched:
            removed_instructions.append(s["text"][:80])
        else:
            clean.append(s)
    sentences = clean

    # 3e. Detect and remove duplicated IELTS example intro
    dupe_removed = 0
    if len(sentences) > 10:
        first_text = sentences[0]["text"].lower().strip()[:40]
        dupe_start = -1
        for i in range(3, min(20, len(sentences))):
            if sentences[i]["text"].lower().strip()[:40] == first_text:
                dupe_start = i
                break
        if dupe_start > 0:
            dupe_removed = dupe_start
            sentences = sentences[dupe_start:]

    # 3f. Merge very short segments (without making them too long)
    merged = []
    for s in sentences:
        if not merged:
            merged.append(dict(s))
            continue
        prev = merged[-1]
        prev_words = prev["text"].split()
        current_words = s["text"].split()
        combined_words = len(prev_words) + len(current_words)
        combined_duration = s["endTime"] - prev["startTime"]
        gap = s["startTime"] - prev["endTime"]

        can_merge = (
            len(current_words) < MIN_WORDS_PER_SENTENCE
            and combined_words <= HARD_MAX_WORDS_PER_SENTENCE
            and combined_duration <= 6.0
            and gap <= 1.0
        )
        if can_merge:
            prev["text"] = clean_join_words((prev["text"] + " " + s["text"]).split())
            prev["endTime"] = s["endTime"]
        else:
            merged.append(dict(s))
    sentences = merged

    # 3g. Repair bad splits after merge
    repaired = []
    for s in sentences:
        if not repaired:
            repaired.append(dict(s))
            continue
        prev = repaired[-1]
        prev_words = prev["text"].split()
        current_words = s["text"].split()
        if not prev_words or not current_words:
            repaired.append(dict(s))
            continue

        prev_last = prev_words[-1]
        current_first = current_words[0]
        combined_words = len(prev_words) + len(current_words)
        combined_duration = s["endTime"] - prev["startTime"]
        gap = s["startTime"] - prev["endTime"]

        should_repair = (
            is_bad_split_boundary(prev_last, current_first)
            and combined_words <= HARD_MAX_WORDS_PER_SENTENCE
            and combined_duration <= 6.5
            and gap <= 1.2
        )
        if should_repair:
            prev["text"] = clean_join_words((prev["text"] + " " + s["text"]).split())
            prev["endTime"] = s["endTime"]
        else:
            repaired.append(dict(s))
    sentences = repaired

    # 3h. Remove final hallucinations after merge/repair
    final_sentences = []
    final_hallucination_count = 0
    for s in sentences:
        if is_hallucination_sentence(s):
            final_hallucination_count += 1
        else:
            final_sentences.append(s)
    sentences = final_sentences
    hallucination_count += final_hallucination_count

    # 3i. Re-index
    for i, s in enumerate(sentences):
        s["index"] = i

    report = {
        "rawChunks": total_raw,
        "hallucinationsRemoved": hallucination_count,
        "introSkipped": skipped_intro,
        "duplicateExampleRemoved": dupe_removed,
        "instructionsRemoved": len(removed_instructions),
        "finalSentences": len(sentences),
        "removedInstructions": removed_instructions,
    }

    return sentences, report

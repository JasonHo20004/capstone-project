"""
RAG Service - Flashcard Generator
Generates flashcards from document chunks via the LLM service
(Vertex AI first, then Ollama — the AI Studio Gemini keys are skipped here).
"""

import json
from app.config import get_settings
from app.models.schemas import FlashcardItem
from app.services.llm_service import generate_text


FLASHCARD_PROMPT = """You are an expert bilingual (English-Vietnamese) language teacher creating flashcards.

Based on the following content, create as many flashcards as appropriate.
Extract ALL important vocabulary, terms, and key concepts from the content.
Do NOT limit yourself — create one flashcard per important term/concept found.

Each flashcard MUST have:
- "front_content": The vocabulary word or key concept (in English)
- "back_content": English definition FIRST, then Vietnamese translation in parentheses. Format: "English definition (Vietnamese translation)"
- "example_sentence": A sample sentence using the term (in English)

IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanation, no extra text.
Example format:
[
  {{"front_content": "Photosynthesis", "back_content": "The process by which green plants convert sunlight into energy (Quang hợp - quá trình cây xanh chuyển đổi ánh sáng thành năng lượng)", "example_sentence": "Photosynthesis is essential for plant growth."}},
  {{"front_content": "Meticulous", "back_content": "Very careful and precise about details (Rất cẩn thận và chính xác về chi tiết)", "example_sentence": "She is meticulous in her research, checking every source twice."}}
]

Content:
{context}

Generate flashcards for ALL important terms/concepts as a JSON array:"""


async def generate_flashcards(chunks: list[str]) -> list[FlashcardItem]:
    """
    Generate flashcards from document chunks. Uses Vertex AI (Gemini on the GCP
    credit) first and falls back straight to Ollama — the AI Studio Gemini keys
    are skipped (use_api_keys=False) because they 429 / risk ToS bans. The LLM
    decides how many flashcards to create based on content.
    """
    settings = get_settings()
    context = "\n\n---\n\n".join(chunks[:10])  # Limit context size

    prompt = FLASHCARD_PROMPT.format(context=context)

    # json_mode constrains the provider to emit valid JSON (the prompt asks for a
    # JSON array) so _parse_json_array rarely has to salvage.
    # use_api_keys=False → Vertex → Ollama, skipping the AI Studio key tier.
    raw_text = await generate_text(
        prompt, settings, temperature=0.3, max_tokens=8192, timeout=300,
        json_mode=True, use_api_keys=False,
    )

    # Parse JSON from LLM response
    flashcards = _parse_json_array(raw_text)

    result = []
    for item in flashcards:
        try:
            result.append(FlashcardItem(
                front_content=item.get("front_content", ""),
                back_content=item.get("back_content", ""),
                example_sentence=item.get("example_sentence"),
            ))
        except Exception:
            continue

    return result


def _parse_json_array(text: str) -> list[dict]:
    """
    Extract a JSON array from LLM response text.
    Handles cases where LLM wraps JSON in markdown code blocks.
    """
    # Try direct parse first
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code block
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            cleaned = part.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                continue

    # Try finding array brackets
    start = text.find("[")
    end = text.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            pass

    return []

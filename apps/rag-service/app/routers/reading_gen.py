"""
RAG Service - AI Reading Question Generator
POST /api/rag/reading/generate → Generate IELTS Reading questions from a passage
"""

import json
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


class ReadingGenResponse(BaseModel):
    success: bool = True
    questions: list[GeneratedQuestion] = []
    summary: str = ""


# ── Prompt ────────────────────────────────────────────────────────────────────

READING_GEN_PROMPT = """You are an expert IELTS exam question writer. Generate IELTS Reading questions from the given passage.

**PASSAGE:**
{passage}

**REQUIREMENTS:**
- Generate exactly {num_questions} questions
- Question types to use: {question_types_list}
- Difficulty level: {difficulty}
- Questions must be answerable from the passage only
- Include clear explanations for each answer

**IMPORTANT: Return ONLY valid JSON (no markdown, no ```json, no extra text).**

Return a JSON array where each question follows this EXACT format based on its type:

For MULTIPLE_CHOICE:
{{
  "questionType": "MULTIPLE_CHOICE",
  "questionText": "What does the author suggest about...?",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "content": {{"text": "What does the author suggest about...?", "options": ["Option A text", "Option B text", "Option C text", "Option D text"]}},
  "answer": {{"correctIndex": 0}},
  "explanation": "The answer is A because the passage states..."
}}

For TRUE_FALSE_NOT_GIVEN:
{{
  "questionType": "TRUE_FALSE_NOT_GIVEN",
  "questionText": "The statement about...",
  "options": [],
  "content": {{"text": "The statement about..."}},
  "answer": {{"correctAnswer": "TRUE"}},
  "explanation": "This is TRUE because paragraph 2 says..."
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

For GAP_FILL (Summary Completion):
{{
  "questionType": "GAP_FILL",
  "questionText": "Complete the summary below",
  "options": [],
  "content": {{"text": "Complete the summary below", "instruction": "Choose ONE WORD ONLY from the passage for each answer.", "summaryText": "The research found that {{{{1}}}} was the main factor in..."}},
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

Generate {num_questions} questions now. Mix the types as specified. Return ONLY the JSON array."""


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/api/rag/reading/generate", response_model=ReadingGenResponse)
async def generate_reading_questions(body: ReadingGenRequest):
    """Generate IELTS Reading questions from a passage using Ollama LLM."""
    settings = get_settings()

    types_list = ", ".join(body.question_types)
    prompt = READING_GEN_PROMPT.format(
        passage=body.passage[:6000],
        num_questions=body.num_questions,
        question_types_list=types_list,
        difficulty=body.difficulty,
    )

    url = f"{settings.ollama_base_url}/api/generate"
    print(f"[Reading Gen] Calling Ollama at: {url}")
    print(f"[Reading Gen] Passage length: {len(body.passage)}, types: {types_list}")

    try:
        resp = requests.post(
            url,
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.4,
                    "num_predict": 8192,
                },
            },
            timeout=600,  # LLM may take time for many questions
        )
    except requests.exceptions.ConnectionError as e:
        print(f"[Reading Gen] Connection error: {e}")
        raise HTTPException(503, "AI service unavailable. Check Colab tunnel.")

    if resp.status_code != 200:
        print(f"[Reading Gen] Ollama error {resp.status_code}: {resp.text[:500]}")
        raise HTTPException(502, f"Ollama error: {resp.status_code}")

    raw = resp.json().get("response", "").strip()
    print(f"[Reading Gen] Raw response length: {len(raw)}")

    # Parse JSON from LLM response (handle markdown fences)
    json_str = raw
    if "```json" in json_str:
        json_str = json_str.split("```json")[1].split("```")[0].strip()
    elif "```" in json_str:
        json_str = json_str.split("```")[1].split("```")[0].strip()

    # Try to find JSON array
    start = json_str.find("[")
    end = json_str.rfind("]")
    if start != -1 and end != -1:
        json_str = json_str[start : end + 1]

    try:
        questions_raw = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"[Reading Gen] JSON parse error: {e}")
        print(f"[Reading Gen] Raw output: {raw[:1000]}")
        raise HTTPException(
            422,
            f"AI generated invalid JSON. Please try again. Error: {str(e)[:200]}"
        )

    if not isinstance(questions_raw, list):
        raise HTTPException(422, "AI did not return a question array. Retry.")

    # Validate and normalize
    questions = []
    for i, q in enumerate(questions_raw):
        if not isinstance(q, dict):
            continue

        qt = q.get("questionType", "MULTIPLE_CHOICE")
        # Normalize type
        valid_types = {
            "MULTIPLE_CHOICE", "TRUE_FALSE_NOT_GIVEN", "YES_NO_NOT_GIVEN",
            "GAP_FILL", "MATCHING", "SHORT_ANSWER", "MULTIPLE_CHOICE_MULTI_ANSWER",
        }
        if qt not in valid_types:
            qt = "MULTIPLE_CHOICE"

        gq = GeneratedQuestion(
            questionText=q.get("questionText", f"Question {i+1}"),
            questionType=qt,
            options=q.get("options", []),
            content=q.get("content", {}),
            answer=q.get("answer", {}),
            explanation=q.get("explanation", ""),
            questionOrder=i + 1,
        )
        questions.append(gq)

    print(f"[Reading Gen] Generated {len(questions)} questions")

    return ReadingGenResponse(
        success=True,
        questions=questions,
        summary=f"Generated {len(questions)} IELTS Reading questions ({types_list})"
    )

"""
RAG Service - AI Tutor Explain Router
POST /api/rag/explain        → Non-streaming (legacy)
POST /api/rag/explain/stream  → SSE streaming (new)
"""

import json
import requests
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ExplainRequest, ExplainResponse
from app.config import get_settings

router = APIRouter(tags=["AI Tutor"])


EXPLAIN_PROMPT = """You are an expert IELTS Reading tutor. A student just answered a question incorrectly. Your job is to explain clearly why their answer is wrong and why the correct answer is right.

**RULES:**
- Respond in Vietnamese (the student speaks Vietnamese)
- Quote specific sentences/phrases from the passage as evidence
- Be encouraging but honest
- Structure your response in 3 clear sections

**PASSAGE:**
{passage}

**QUESTION ({question_type}):**
{question_text}

**OPTIONS:**
{options_text}

**CORRECT ANSWER:** {correct_answer}
**STUDENT'S ANSWER:** {user_answer}

{conversation_context}

Please explain in this exact format:

✅ **Đáp án đúng: {correct_answer}**
[Giải thích tại sao đáp án này đúng, trích dẫn câu/cụm từ cụ thể từ passage]

❌ **Bạn chọn: {user_answer}**
[Giải thích tại sao đáp án này sai, chỉ ra "bẫy" hoặc lý do nhầm lẫn]

💡 **Mẹo:**
[Đưa ra 1-2 mẹo cụ thể cho dạng câu hỏi {question_type} để tránh sai lần sau]"""


FOLLOWUP_PROMPT = """You are an expert IELTS Reading tutor having a conversation with a student about a specific question they got wrong.

**CONTEXT:**
- Passage: {passage}
- Question: {question_text}
- Correct answer: {correct_answer}
- Student's answer: {user_answer}

**CONVERSATION SO FAR:**
{history_text}

**STUDENT'S NEW QUESTION:**
{followup}

**RULES:**
- Respond in Vietnamese
- Reference the passage when relevant
- Be clear, concise, and helpful
- If they ask about vocabulary, explain the word in context

Answer:"""


def _build_prompt(body: ExplainRequest) -> str:
    """Build the LLM prompt from request body."""
    options_text = "\n".join(
        f"  {chr(65 + i)}. {opt}" for i, opt in enumerate(body.options)
    ) if body.options else "(no options)"

    if not body.conversation_history:
        return EXPLAIN_PROMPT.format(
            passage=body.passage[:4000],
            question_type=body.question_type,
            question_text=body.question_text,
            options_text=options_text,
            correct_answer=body.correct_answer,
            user_answer=body.user_answer,
            conversation_context="",
        )
    else:
        history_text = "\n".join(
            f"{'Student' if m.role == 'user' else 'Tutor'}: {m.content}"
            for m in body.conversation_history
        )
        followup = body.conversation_history[-1].content if body.conversation_history else ""
        return FOLLOWUP_PROMPT.format(
            passage=body.passage[:3000],
            question_text=body.question_text,
            correct_answer=body.correct_answer,
            user_answer=body.user_answer,
            history_text=history_text,
            followup=followup,
        )


# ── Legacy non-streaming endpoint ─────────────────────────────────────────────

@router.post("/api/rag/explain", response_model=ExplainResponse)
async def explain_answer(body: ExplainRequest):
    """AI Tutor: Non-streaming explanation (legacy)."""
    settings = get_settings()
    prompt = _build_prompt(body)

    url = f"{settings.ollama_base_url}/api/generate"
    print(f"[AI Tutor] Calling Ollama at: {url}")

    try:
        resp = requests.post(
            url,
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 2048},
            },
            timeout=300,
        )
    except requests.exceptions.ConnectionError as e:
        print(f"[AI Tutor] Connection error: {e}")
        raise HTTPException(503, "AI service unavailable. Check Colab tunnel.")

    if resp.status_code != 200:
        print(f"[AI Tutor] Ollama error {resp.status_code}: {resp.text[:500]}")
        raise HTTPException(502, f"Ollama error: {resp.status_code}")

    answer = resp.json().get("response", "").strip()

    if not answer:
        raise HTTPException(500, "AI failed to generate explanation. Try again.")

    passage_ref = ""
    for line in answer.split("\n"):
        if '"' in line or '"' in line or '«' in line:
            passage_ref = line.strip()
            break

    tips = ""
    in_tips = False
    for line in answer.split("\n"):
        if "💡" in line or "Mẹo" in line:
            in_tips = True
        if in_tips:
            tips += line + "\n"

    return ExplainResponse(
        explanation=answer,
        passage_reference=passage_ref,
        tips=tips.strip(),
    )


# ── SSE Streaming endpoint ────────────────────────────────────────────────────

@router.post("/api/rag/explain/stream")
async def explain_answer_stream(body: ExplainRequest):
    """
    AI Tutor: SSE streaming explanation.
    Returns text/event-stream with tokens as they arrive from Ollama.
    """
    settings = get_settings()
    prompt = _build_prompt(body)

    def generate_sse():
        url = f"{settings.ollama_base_url}/api/generate"
        print(f"[AI Tutor SSE] Calling Ollama stream at: {url}")

        try:
            resp = requests.post(
                url,
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "stream": True,
                    "options": {"temperature": 0.3, "num_predict": 2048},
                },
                timeout=300,
                stream=True,  # Enable requests streaming
            )
        except requests.exceptions.ConnectionError as e:
            print(f"[AI Tutor SSE] Connection error: {e}")
            error_data = json.dumps({"error": "AI service unavailable"})
            yield f"event: error\ndata: {error_data}\n\n"
            return

        if resp.status_code != 200:
            error_data = json.dumps({"error": f"Ollama error: {resp.status_code}"})
            yield f"event: error\ndata: {error_data}\n\n"
            return

        full_response = ""
        for line in resp.iter_lines():
            if not line:
                continue
            try:
                chunk = json.loads(line)
                token = chunk.get("response", "")
                done = chunk.get("done", False)

                if token:
                    full_response += token
                    # SSE format: data: {"token": "..."}
                    data = json.dumps({"token": token}, ensure_ascii=False)
                    yield f"data: {data}\n\n"

                if done:
                    # Send done event with full response
                    done_data = json.dumps({
                        "done": True,
                        "full_response": full_response,
                    }, ensure_ascii=False)
                    yield f"event: done\ndata: {done_data}\n\n"
                    break

            except json.JSONDecodeError:
                continue

    return StreamingResponse(
        generate_sse(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering if behind nginx
        },
    )

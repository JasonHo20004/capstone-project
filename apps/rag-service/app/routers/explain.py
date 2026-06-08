"""
RAG Service - AI Tutor Explain Router
POST /api/rag/explain        → Non-streaming (legacy)
POST /api/rag/explain/stream  → SSE streaming (new)
"""

import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ExplainRequest, ExplainResponse
from app.config import get_settings
from app.services.llm_service import generate_text, generate_text_stream

router = APIRouter(tags=["AI Tutor"])


# ── Prompts ───────────────────────────────────────────────────────────────────

EXPLAIN_PROMPT = """Bạn là gia sư IELTS Reading chuyên nghiệp. Một học sinh vừa trả lời sai câu hỏi dưới đây. Hãy giải thích rõ ràng, trích dẫn đúng từ passage.

**PASSAGE:**
{passage}

**CÂU HỎI (dạng: {question_type}):**
{question_text}

{options_block}**ĐÁP ÁN ĐÚNG:** {correct_answer}
**HỌC SINH CHỌN:** {user_answer}

{type_guidance}

Trả lời theo đúng định dạng sau (không thêm gì ngoài format này):

✅ **Tại sao "{correct_answer}" là đúng:**
[Giải thích logic, trích dẫn câu/cụm từ cụ thể từ passage trong dấu ngoặc kép. Chỉ rõ đoạn nào trong passage xác nhận điều này.]

❌ **Tại sao "{user_answer}" là sai:**
[Giải thích bẫy hoặc lý do nhầm lẫn. Nếu có thể, chỉ ra sự khác biệt giữa thông tin trong passage và đáp án sai.]

💡 **Mẹo cho dạng {question_type}:**
[1–2 chiến thuật cụ thể, thực tế để không mắc lỗi tương tự trong tương lai.]"""


FOLLOWUP_PROMPT = """Bạn là gia sư IELTS Reading. Đang giải thích câu hỏi cho học sinh.

**NGỮ CẢNH:**
- Đoạn văn: {passage}
- Câu hỏi: {question_text}
- Đáp án đúng: {correct_answer}
- Học sinh đã chọn: {user_answer}

**LỊCH SỬ CUỘC TRÒ CHUYỆN:**
{history_text}

**CÂU HỎI MỚI CỦA HỌC SINH:**
{followup}

Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt. Trích dẫn passage khi cần thiết."""


# ── Listening-specific prompts ─────────────────────────────────────────────────

LISTENING_WITH_TRANSCRIPT_EXPLAIN_PROMPT = """Bạn là gia sư IELTS Listening chuyên nghiệp. Học sinh vừa trả lời sai câu hỏi nghe dưới đây. Hãy giải thích dựa trên transcript audio được cung cấp.

**TRANSCRIPT AUDIO:**
{passage}

**CÂU HỎI (dạng: {question_type}):**
{question_text}

{options_block}**ĐÁP ÁN ĐÚNG:** {correct_answer}
**HỌC SINH CHỌN:** {user_answer}

{type_guidance}

Trả lời theo đúng định dạng sau (không thêm gì ngoài format này):

✅ **Tại sao "{correct_answer}" là đúng:**
[Giải thích logic, trích dẫn câu/cụm từ cụ thể từ transcript trong dấu ngoặc kép. Chỉ rõ phần nào trong audio xác nhận đáp án này.]

❌ **Tại sao "{user_answer}" là sai:**
[Giải thích bẫy hoặc lý do nhầm lẫn. Chỉ ra distractor trong transcript nếu có.]

💡 **Mẹo cho dạng {question_type} trong Listening:**
[1–2 chiến thuật nghe cụ thể để không mắc lỗi tương tự trong tương lai.]"""


LISTENING_WITH_TRANSCRIPT_FOLLOWUP_PROMPT = """Bạn là gia sư IELTS Listening. Đang giải thích câu hỏi nghe dựa trên transcript.

**NGỮ CẢNH:**
- Transcript audio: {passage}
- Câu hỏi: {question_text}
- Đáp án đúng: {correct_answer}
- Học sinh đã chọn: {user_answer}

**LỊCH SỬ CUỘC TRÒ CHUYỆN:**
{history_text}

**CÂU HỎI MỚI CỦA HỌC SINH:**
{followup}

Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt. Trích dẫn transcript khi cần thiết."""


LISTENING_EXPLAIN_PROMPT = """Bạn là gia sư IELTS Listening chuyên nghiệp. Học sinh vừa trả lời sai câu hỏi nghe dưới đây. Hãy giải thích rõ ràng dựa trên kiến thức IELTS Listening.

**CÂU HỎI (dạng: {question_type}):**
{question_text}

{options_block}**ĐÁP ÁN ĐÚNG:** {correct_answer}
**HỌC SINH CHỌN:** {user_answer}

{type_guidance}

Trả lời theo đúng định dạng sau (không thêm gì ngoài format này):

✅ **Tại sao "{correct_answer}" là đúng:**
[Giải thích tại sao đây là đáp án đúng. Nêu keyword/signal word thường xuất hiện trong audio để xác nhận, và cách paraphrase phổ biến trong IELTS Listening.]

❌ **Tại sao "{user_answer}" là sai:**
[Giải thích bẫy phổ biến trong IELTS Listening dẫn đến lỗi này: distractor, paraphrase dễ nhầm, số/ngày/tên dễ nghe sai.]

💡 **Mẹo cho dạng {question_type} trong Listening:**
[1–2 chiến thuật nghe cụ thể để không mắc lỗi tương tự trong tương lai.]"""


LISTENING_FOLLOWUP_PROMPT = """Bạn là gia sư IELTS Listening. Đang giải thích câu hỏi nghe cho học sinh.

**NGỮ CẢNH:**
- Câu hỏi: {question_text}
- Đáp án đúng: {correct_answer}
- Học sinh đã chọn: {user_answer}

**LỊCH SỬ CUỘC TRÒ CHUYỆN:**
{history_text}

**CÂU HỎI MỚI CỦA HỌC SINH:**
{followup}

Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt. Tập trung vào kỹ năng nghe và chiến thuật IELTS Listening."""


LISTENING_TYPE_GUIDANCE = {
    "MULTIPLE_CHOICE": """**Lưu ý MCQ Listening:**
- Đọc câu hỏi và các lựa chọn TRƯỚC khi nghe để dự đoán nội dung
- Distractor thường được nhắc trong audio nhưng bị phủ nhận ("but", "however", "actually")
- Đáp án đúng thường là paraphrase — không nhất thiết dùng từ y chang trong audio""",

    "GAP_FILL": """**Lưu ý Gap Fill Listening:**
- Đáp án thường là từ nghe trực tiếp từ audio (không paraphrase)
- Kiểm tra số từ giới hạn và loại từ cần điền (noun, number, date...)
- Chú ý spelling — audio thường spell ra các từ khó""",

    "SHORT_ANSWER": """**Lưu ý Short Answer Listening:**
- Nghe kỹ keyword trong câu hỏi để xác định vị trí trong audio
- Câu trả lời thường xuất hiện theo đúng thứ tự câu hỏi
- Không viết quá số từ quy định""",

    "MATCHING": """**Lưu ý Matching Listening:**
- Đọc danh sách options trước, gạch chân từ khóa phân biệt
- Audio thường paraphrase — lắng nghe ý nghĩa, không chỉ từ y chang
- Distractor thường được đề cập trước đáp án đúng""",
}


TYPE_GUIDANCE = {
    "TRUE_FALSE_NOT_GIVEN": """**Lưu ý đặc biệt cho T/F/NG:**
- TRUE: Passage khẳng định rõ ràng thông tin này
- FALSE: Passage phủ nhận hoặc mâu thuẫn trực tiếp với thông tin này
- NOT GIVEN: Passage không đề cập đến thông tin này (không phải FALSE!)
Cẩn thận: NOT GIVEN ≠ thông tin sai, chỉ là không có trong passage.""",

    "YES_NO_NOT_GIVEN": """**Lưu ý đặc biệt cho Y/N/NG:**
- YES: Quan điểm trong câu hỏi khớp với quan điểm tác giả trong passage
- NO: Quan điểm trái ngược với tác giả
- NOT GIVEN: Tác giả không đề cập đến quan điểm này""",

    "MULTIPLE_CHOICE": """**Lưu ý cho MCQ:**
- Chú ý các từ tuyệt đối: "always", "never", "all", "only" — thường là bẫy
- Đáp án đúng thường paraphrase (diễn đạt lại) thay vì copy y chang từ passage""",

    "GAP_FILL": """**Lưu ý cho Gap Fill:**
- Đáp án thường lấy trực tiếp từ passage (verbatim)
- Kiểm tra số lượng từ được phép điền và ngữ pháp""",

    "MATCHING": """**Lưu ý cho Matching:**
- Tìm keywords trong câu hỏi, scan passage để locate
- Cẩn thận với distractor — đúng từ ngữ nhưng sai ngữ cảnh""",

    "SHORT_ANSWER": """**Lưu ý cho Short Answer:**
- Trả lời bằng từ/cụm từ từ passage, không paraphrase
- Đếm số từ giới hạn (thường "no more than 3 words")""",
}


def _build_prompt_split(body: ExplainRequest) -> tuple[str, str]:
    """Build separate system and user prompts from request body."""
    is_listening = body.test_skill == "LISTENING"
    has_transcript = is_listening and body.passage != "[LISTENING]"

    options_block = ""
    if body.options:
        lines = "\n".join(f"  {chr(65 + i)}. {opt}" for i, opt in enumerate(body.options))
        options_block = f"**CÁC LỰA CHỌN:**\n{lines}\n\n"

    history_text = "(chưa có)"
    followup = ""
    if body.conversation_history:
        history_messages = body.conversation_history[:-1]
        history_text = "\n".join(
            f"{'Học sinh' if m.role == 'user' else 'Gia sư'}: {m.content}"
            for m in history_messages
        ) or "(chưa có)"
        followup = body.conversation_history[-1].content

    # ── Listening + real transcript ───────────────────────────────────────────
    if has_transcript:
        type_guidance = LISTENING_TYPE_GUIDANCE.get(body.question_type, "")
        if not body.conversation_history:
            system_prompt = """Bạn là gia sư IELTS Listening chuyên nghiệp. Hãy giải thích dựa trên transcript audio được cung cấp.

Trả lời theo đúng định dạng sau (không thêm gì ngoài format này):

✅ **Tại sao "{correct_answer}" là đúng:**
[Giải thích logic, trích dẫn câu/cụm từ cụ thể từ transcript trong dấu ngoặc kép. Chỉ rõ phần nào trong audio xác nhận đáp án này.]

❌ **Tại sao "{user_answer}" là sai:**
[Giải thích bẫy hoặc lý do nhầm lẫn. Chỉ ra distractor trong transcript nếu có.]

💡 **Mẹo cho dạng {question_type} trong Listening:**
[1–2 chiến thuật nghe cụ thể để không mắc lỗi tương tự trong tương lai.]""".format(
                correct_answer=body.correct_answer,
                user_answer=body.user_answer,
                question_type=body.question_type,
            )
            user_prompt = """Học sinh vừa trả lời sai câu hỏi nghe dưới đây.

**TRANSCRIPT AUDIO:**
{passage}

**CÂU HỎI (dạng: {question_type}):**
{question_text}

{options_block}**ĐÁP ÁN ĐÚNG:** {correct_answer}
**HỌC SINH CHỌN:** {user_answer}

{type_guidance}""".format(
                passage=body.passage[:4000],
                question_type=body.question_type,
                question_text=body.question_text,
                options_block=options_block,
                correct_answer=body.correct_answer,
                user_answer=body.user_answer,
                type_guidance=type_guidance,
            )
            return system_prompt, user_prompt

        system_prompt = """Bạn là gia sư IELTS Listening. Đang giải thích câu hỏi nghe dựa trên transcript.
Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt. Trích dẫn transcript khi cần thiết."""
        user_prompt = """**NGỮ CẢNH:**
- Transcript audio: {passage}
- Câu hỏi: {question_text}
- Đáp án đúng: {correct_answer}
- Học sinh đã chọn: {user_answer}

**LỊCH SỬ CUỘC TRÒ CHUYỆN:**
{history_text}

**CÂU HỎI MỚI CỦA HỌC SINH:**
{followup}""".format(
            passage=body.passage[:3000],
            question_text=body.question_text,
            correct_answer=body.correct_answer,
            user_answer=body.user_answer,
            history_text=history_text,
            followup=followup,
        )
        return system_prompt, user_prompt

    # ── Listening, no transcript ──────────────────────────────────────────────
    if is_listening:
        type_guidance = LISTENING_TYPE_GUIDANCE.get(body.question_type, "")
        if not body.conversation_history:
            system_prompt = """Bạn là gia sư IELTS Listening chuyên nghiệp. Hãy giải thích rõ ràng dựa trên kiến thức IELTS Listening.

Trả lời theo đúng định dạng sau (không thêm gì ngoài format này):

✅ **Tại sao "{correct_answer}" là đúng:**
[Giải thích tại sao đây là đáp án đúng. Nêu keyword/signal word thường xuất hiện trong audio để xác nhận, và cách paraphrase phổ biến trong IELTS Listening.]

❌ **Tại sao "{user_answer}" là sai:**
[Giải thích bẫy phổ biến trong IELTS Listening dẫn đến lỗi này: distractor, paraphrase dễ nhầm, số/ngày/tên dễ nghe sai.]

💡 **Mẹo cho dạng {question_type} trong Listening:**
[1–2 chiến thuật nghe cụ thể để không mắc lỗi tương tự trong tương lai.]""".format(
                correct_answer=body.correct_answer,
                user_answer=body.user_answer,
                question_type=body.question_type,
            )
            user_prompt = """Học sinh vừa trả lời sai câu hỏi nghe dưới đây.

**CÂU HỎI (dạng: {question_type}):**
{question_text}

{options_block}**ĐÁP ÁN ĐÚNG:** {correct_answer}
**HỌC SINH CHỌN:** {user_answer}

{type_guidance}""".format(
                question_type=body.question_type,
                question_text=body.question_text,
                options_block=options_block,
                correct_answer=body.correct_answer,
                user_answer=body.user_answer,
                type_guidance=type_guidance,
            )
            return system_prompt, user_prompt

        system_prompt = """Bạn là gia sư IELTS Listening. Đang giải thích câu hỏi nghe cho học sinh.
Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt. Tập trung vào kỹ năng nghe và chiến thuật IELTS Listening."""
        user_prompt = """**NGỮ CẢNH:**
- Câu hỏi: {question_text}
- Đáp án đúng: {correct_answer}
- Học sinh đã chọn: {user_answer}

**LỊCH SỬ CUỘC TRÒ CHUYỆN:**
{history_text}

**CÂU HỎI MỚI CỦA HỌC SINH:**
{followup}""".format(
            question_text=body.question_text,
            correct_answer=body.correct_answer,
            user_answer=body.user_answer,
            history_text=history_text,
            followup=followup,
        )
        return system_prompt, user_prompt

    # ── Reading ───────────────────────────────────────────────────────────────
    type_guidance = TYPE_GUIDANCE.get(body.question_type, "")
    if not body.conversation_history:
        system_prompt = """Bạn là gia sư IELTS Reading chuyên nghiệp. Hãy giải thích rõ ràng, trích dẫn đúng từ passage.

Trả lời theo đúng định dạng sau (không thêm gì ngoài format này):

✅ **Tại sao "{correct_answer}" là đúng:**
[Giải thích logic, trích dẫn câu/cụm từ cụ thể từ passage trong dấu ngoặc kép. Chỉ rõ đoạn nào trong passage xác nhận điều này.]

❌ **Tại sao "{user_answer}" là sai:**
[Giải thích bẫy hoặc lý do nhầm lẫn. Nếu có thể, chỉ ra sự khác biệt giữa thông tin trong passage và đáp án sai.]

💡 **Mẹo cho dạng {question_type}:**
[1–2 chiến thuật cụ thể, thực tế để không mắc lỗi tương tự trong tương lai.]""".format(
            correct_answer=body.correct_answer,
            user_answer=body.user_answer,
            question_type=body.question_type,
        )
        user_prompt = """Một học sinh vừa trả lời sai câu hỏi dưới đây.

**PASSAGE:**
{passage}

**CÂU HỎI (dạng: {question_type}):**
{question_text}

{options_block}**ĐÁP ÁN ĐÚNG:** {correct_answer}
**HỌC SINH CHỌN:** {user_answer}

{type_guidance}""".format(
            passage=body.passage[:4000],
            question_type=body.question_type,
            question_text=body.question_text,
            options_block=options_block,
            correct_answer=body.correct_answer,
            user_answer=body.user_answer,
            type_guidance=type_guidance,
        )
        return system_prompt, user_prompt

    system_prompt = """Bạn là gia sư IELTS Reading. Đang giải thích câu hỏi cho học sinh.
Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt. Trích dẫn passage khi cần thiết."""
    user_prompt = """**NGỮ CẢNH:**
- Đoạn văn: {passage}
- Câu hỏi: {question_text}
- Đáp án đúng: {correct_answer}
- Học sinh đã chọn: {user_answer}

**LỊCH SỬ CUỘC TRÒ CHUYỆN:**
{history_text}

**CÂU HỎI MỚI CỦA HỌC SINH:**
{followup}""".format(
        passage=body.passage[:3000],
        question_text=body.question_text,
        correct_answer=body.correct_answer,
        user_answer=body.user_answer,
        history_text=history_text,
        followup=followup,
    )
    return system_prompt, user_prompt


# Local multilingual models (e.g. Qwen) often drift into Chinese for the
# explanatory prose even though the prompt is Vietnamese. Force the output
# language explicitly (following the UI's i18n language) and forbid other scripts.
_LANGUAGE_NAMES = {
    "vi": "Tiếng Việt (Vietnamese)",
    "en": "English",
}


def _language_directive(lang: str) -> str:
    """Append a strong instruction to answer in the UI language and nothing else."""
    code = (lang or "vi").split("-")[0].lower()
    name = _LANGUAGE_NAMES.get(code, "Tiếng Việt (Vietnamese)")
    return (
        "\n\n---\n"
        f"IMPORTANT — LANGUAGE: Write the ENTIRE answer in {name}, including the "
        "section headings (translate the Vietnamese headings in the format above "
        f"into {name}). Do NOT use Chinese (中文/汉字), Japanese, Korean, or any "
        "other language. Keep the original English only for direct quotes copied "
        "from the passage/transcript (inside quotation marks)."
    )


# Generation tuning for the AI Tutor (shared by both endpoints).
_TUTOR_TEMPERATURE = 0.3
_TUTOR_MAX_TOKENS = 1024


# ── Legacy non-streaming endpoint ─────────────────────────────────────────────

@router.post("/api/rag/explain", response_model=ExplainResponse)
async def explain_answer(body: ExplainRequest):
    """AI Tutor: Non-streaming explanation (legacy). Gemini-first (multi-key),
    automatic fallback to Ollama only when every Gemini key is exhausted."""
    settings = get_settings()
    system_prompt, user_prompt = _build_prompt_split(body)
    system_prompt += _language_directive(body.language)

    answer = (await generate_text(
        user_prompt, settings, system_prompt=system_prompt,
        temperature=_TUTOR_TEMPERATURE, max_tokens=_TUTOR_MAX_TOKENS, timeout=300,
    )).strip()
    if not answer:
        raise HTTPException(500, "AI không tạo được giải thích. Thử lại.")

    passage_ref = next(
        (line.strip() for line in answer.split("\n") if '"' in line or '“' in line),
        "",
    )
    tips = ""
    in_tips = False
    for line in answer.split("\n"):
        if "💡" in line or "Mẹo" in line:
            in_tips = True
        if in_tips:
            tips += line + "\n"

    return ExplainResponse(explanation=answer, passage_reference=passage_ref, tips=tips.strip())


# ── SSE Streaming endpoint ────────────────────────────────────────────────────

@router.post("/api/rag/explain/stream")
async def explain_answer_stream(body: ExplainRequest):
    """
    AI Tutor: SSE streaming explanation. Streams tokens from Gemini (multi-key,
    skipping rate-limited keys); falls back to Ollama only when every Gemini key
    is exhausted.
    """
    settings = get_settings()
    system_prompt, user_prompt = _build_prompt_split(body)
    system_prompt += _language_directive(body.language)

    async def generate_sse():
        print(f"[AI Tutor SSE] type={body.question_type} history={len(body.conversation_history)}")
        full_response = ""
        try:
            async for token in generate_text_stream(
                user_prompt, settings, system_prompt=system_prompt,
                temperature=_TUTOR_TEMPERATURE, max_tokens=_TUTOR_MAX_TOKENS, timeout=300,
            ):
                if token:
                    full_response += token
                    yield f"data: {json.dumps({'token': token}, ensure_ascii=False)}\n\n"
        except Exception as e:
            print(f"[AI Tutor SSE] Generation error: {e}")
            yield f"event: error\ndata: {json.dumps({'error': 'AI gặp lỗi khi tạo nội dung. Thử lại sau.'})}\n\n"
            return

        if not full_response:
            yield f"event: error\ndata: {json.dumps({'error': 'AI không phản hồi. Thử lại sau.'})}\n\n"
            return

        yield f"event: done\ndata: {json.dumps({'done': True, 'full_response': full_response}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        generate_sse(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

"""
LLM service — unified text-generation interface across providers.

Primary: Gemini Flash (Google AI Studio)
Fallback: Ollama (local)

The fallback chain triggers automatically when:
  - llm_provider != "gemini", OR
  - gemini_api_key is empty, OR
  - the Gemini call raises / times out
"""

import json
from typing import Optional

import httpx


GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


async def _generate_gemini(
    prompt: str,
    api_key: str,
    model: str,
    temperature: float,
    max_tokens: int,
    timeout: float,
    json_mode: bool = False,
) -> str:
    url = f"{GEMINI_BASE}/{model}:generateContent?key={api_key}"
    generation_config = {
        "temperature": temperature,
        "maxOutputTokens": max_tokens,
        "topP": 0.9,
        # Gemini 2.5 models are "thinking" models: by default the model spends
        # part of maxOutputTokens on internal reasoning, which can leave 0 tokens
        # for the actual answer → empty `parts`. Disable thinking so the whole
        # budget goes to the visible response.
        "thinkingConfig": {"thinkingBudget": 0},
    }
    if json_mode:
        # Force a syntactically valid JSON response (used for lesson/translate).
        generation_config["responseMimeType"] = "application/json"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": generation_config,
    }
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, json=payload)
        # Older models reject thinkingConfig — retry once without it.
        if resp.status_code == 400 and "thinking" in resp.text.lower():
            payload["generationConfig"].pop("thinkingConfig", None)
            resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()

    # Gemini response format: candidates[0].content.parts[0].text
    candidates = data.get("candidates", [])
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(p.get("text", "") for p in parts).strip()


async def _generate_ollama(
    prompt: str,
    base_url: str,
    model: str,
    temperature: float,
    max_tokens: int,
    timeout: float,
    json_mode: bool = False,
) -> str:
    body = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            # num_ctx is the TOTAL window (prompt + output) in Ollama. The lesson
            # prompt is long and the output can be large; 4096 truncated the JSON
            # mid-response. Size the window to comfortably fit both.
            "num_ctx": max(8192, max_tokens + 2048),
            "top_p": 0.9,
        },
    }
    if json_mode:
        # Force Ollama to emit valid JSON (used for lesson/translate generation).
        body["format"] = "json"
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(f"{base_url}/api/generate", json=body)
        resp.raise_for_status()
        data = resp.json()
    return str(data.get("response", "")).strip()


async def generate_text(
    prompt: str,
    settings,
    *,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    timeout: float = 60.0,
    json_mode: bool = False,
) -> str:
    """Generate text from the configured LLM with automatic fallback to Ollama.

    Set json_mode=True when the prompt asks for a JSON object — both providers are
    then constrained to emit valid JSON (much more reliable parsing). Leave it
    False for free-form prose (e.g. Q&A answers).
    """
    provider = (settings.llm_provider or "ollama").lower()

    if provider == "gemini" and settings.gemini_api_key:
        try:
            text = await _generate_gemini(
                prompt,
                settings.gemini_api_key,
                settings.gemini_model,
                temperature,
                max_tokens,
                timeout,
                json_mode=json_mode,
            )
            if text:
                return text
            print("[LLM] Gemini returned empty response — falling back to Ollama")
        except Exception as e:
            print(f"[LLM] Gemini error ({type(e).__name__}: {e}) — falling back to Ollama")

    try:
        return await _generate_ollama(
            prompt,
            settings.ollama_base_url,
            settings.ollama_model,
            temperature,
            max_tokens,
            timeout,
            json_mode=json_mode,
        )
    except Exception as e:
        print(f"[LLM] Ollama fallback also failed: {e}")
        return ""


def extract_json_object(text: str) -> Optional[dict]:
    """Best-effort JSON extraction from an LLM response that may contain stray prose."""
    if not text:
        return None
    start, end = text.find("{"), text.rfind("}") + 1
    if start < 0 or end <= start:
        return None
    try:
        return json.loads(text[start:end])
    except json.JSONDecodeError:
        return None

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
) -> str:
    url = f"{GEMINI_BASE}/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "topP": 0.9,
        },
    }
    async with httpx.AsyncClient(timeout=timeout) as client:
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
) -> str:
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(
            f"{base_url}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                    "num_ctx": 4096,
                    "top_p": 0.9,
                },
            },
        )
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
) -> str:
    """Generate text from the configured LLM with automatic fallback to Ollama."""
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

"""
LLM service — unified text-generation interface across providers.

Primary: Gemini Flash (Google AI Studio) — supports MULTIPLE keys, round-robined
         and skipped on rate-limit (429) to multiply free-tier limits.
Fallback: Ollama (local)

The fallback to Ollama triggers automatically when:
  - llm_provider != "gemini", OR
  - no Gemini keys are configured, OR
  - every configured Gemini key raises / times out / is rate-limited
"""

import asyncio
import json
import re
from typing import Optional

import httpx


GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

# Round-robin pointer across configured Gemini keys (in-memory, per process). Lets
# multiple free-tier keys share the load and skip past a rate-limited one.
_key_cursor = 0


# ── Vertex AI (Gemini via Google Cloud) ──────────────────────────────────────
# Same Gemini models, but billed to Google Cloud (the $300 credit) and authed
# with the GOOGLE_APPLICATION_CREDENTIALS service account instead of an API key.
# Used when llm_provider="vertex"; on any failure the caller falls back to the
# AI Studio keys, then Ollama.

_VERTEX_SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]
_vertex_creds = None                       # cached google.auth Credentials
_vertex_project_cache: Optional[str] = None  # cached resolved project id


def _vertex_cred_path(settings) -> str:
    """Service-account JSON path for Vertex: VERTEX_CREDENTIALS if set, else the
    shared GOOGLE_APPLICATION_CREDENTIALS. Lets Vertex AI and Cloud TTS each use
    their own key (the TTS key needs only roles/texttospeech.user, the Vertex key
    only Vertex AI access)."""
    return (getattr(settings, "vertex_credentials", "") or
            settings.google_application_credentials or "").strip()


def _load_vertex_token_sync(settings) -> Optional[str]:
    """Return a fresh Vertex OAuth access token, or None. Sync (refresh hits the
    network) — call via asyncio.to_thread so it doesn't block the event loop."""
    global _vertex_creds
    try:
        from google.auth.transport.requests import Request as GARequest
        if _vertex_creds is None:
            cred_path = _vertex_cred_path(settings)
            if cred_path:
                from google.oauth2 import service_account
                _vertex_creds = service_account.Credentials.from_service_account_file(
                    cred_path, scopes=_VERTEX_SCOPES,
                )
            else:
                import google.auth
                _vertex_creds, _ = google.auth.default(scopes=_VERTEX_SCOPES)
        if not _vertex_creds.valid:
            _vertex_creds.refresh(GARequest())
        return _vertex_creds.token
    except Exception as e:
        print(f"[LLM] Vertex auth failed: {e}")
        return None


def _resolve_vertex_project(settings) -> str:
    """Project id for Vertex: settings.vertex_project, else the service-account
    JSON's project_id. Cached after first resolution."""
    global _vertex_project_cache
    if _vertex_project_cache is not None:
        return _vertex_project_cache
    proj = (getattr(settings, "vertex_project", "") or "").strip()
    if not proj:
        cred_path = _vertex_cred_path(settings)
        if cred_path:
            try:
                with open(cred_path, "r", encoding="utf-8") as f:
                    proj = (json.load(f).get("project_id") or "").strip()
            except Exception as e:
                print(f"[LLM] Could not read project_id from credentials: {e}")
    _vertex_project_cache = proj
    return proj


def _vertex_url(project: str, location: str, model: str, method: str) -> str:
    return (
        f"https://{location}-aiplatform.googleapis.com/v1/projects/{project}"
        f"/locations/{location}/publishers/google/models/{model}:{method}"
    )


def _vertex_generation_config(temperature: float, max_tokens: int, json_mode: bool) -> dict:
    cfg = {
        "temperature": temperature,
        "maxOutputTokens": max_tokens,
        "topP": 0.9,
        "thinkingConfig": {"thinkingBudget": 0},
    }
    if json_mode:
        cfg["responseMimeType"] = "application/json"
    return cfg


def _vertex_payload(prompt: str, temperature: float, max_tokens: int,
                    json_mode: bool, system_prompt: Optional[str]) -> dict:
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": _vertex_generation_config(temperature, max_tokens, json_mode),
    }
    if system_prompt:
        payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}
    return payload


async def _generate_vertex(prompt, token, project, location, model, temperature,
                           max_tokens, timeout, json_mode=False, system_prompt=None) -> str:
    url = _vertex_url(project, location, model, "generateContent")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = _vertex_payload(prompt, temperature, max_tokens, json_mode, system_prompt)
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, json=payload, headers=headers)
        if resp.status_code == 400 and "thinking" in resp.text.lower():
            payload["generationConfig"].pop("thinkingConfig", None)
            resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
    candidates = data.get("candidates", [])
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(p.get("text", "") for p in parts).strip()


async def _try_vertex_generate(prompt, settings, *, system_prompt=None, temperature=0.7,
                               max_tokens=1024, timeout=60.0, json_mode=False) -> str:
    """One-shot Vertex generation; returns "" on any failure so the caller can
    fall back to the Gemini API keys."""
    project = _resolve_vertex_project(settings)
    location = (getattr(settings, "vertex_location", "") or "us-central1").strip()
    token = await asyncio.to_thread(_load_vertex_token_sync, settings)
    if not project or not token:
        print(f"[LLM] Vertex not ready (project={'ok' if project else 'MISSING'}, "
              f"token={'ok' if token else 'MISSING'})")
        return ""
    print(f"[LLM] Using Vertex AI: {settings.gemini_model} (project={project}, {location})")
    try:
        text = await _generate_vertex(
            prompt, token, project, location, settings.gemini_model,
            temperature, max_tokens, timeout, json_mode=json_mode, system_prompt=system_prompt,
        )
        if text:
            print(f"[LLM] Vertex responded OK ({len(text)} chars)")
        return text
    except Exception as e:
        msg = str(e).lower()
        rate = "429" in msg or "quota" in msg or "rate" in msg or "resource_exhausted" in msg
        print(f"[LLM] Vertex {'rate-limited' if rate else 'error'} ({type(e).__name__})")
        return ""


async def _stream_vertex(prompt, token, project, location, model, temperature,
                         max_tokens, timeout, json_mode=False, system_prompt=None, meta=None):
    """Async generator yielding tokens from Vertex's SSE streaming endpoint.
    Same SSE shape as _stream_gemini; raises before the first yield on error."""
    url = _vertex_url(project, location, model, "streamGenerateContent") + "?alt=sse"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = _vertex_payload(prompt, temperature, max_tokens, json_mode, system_prompt)
    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", url, json=payload, headers=headers) as resp:
            if resp.status_code != 200:
                body = (await resp.aread()).decode("utf-8", "ignore")
                raise httpx.HTTPStatusError(
                    f"{resp.status_code}: {body[:300]}", request=resp.request, response=resp
                )
            async for line in resp.aiter_lines():
                if not line or not line.startswith("data:"):
                    continue
                data_str = line[len("data:"):].strip()
                if not data_str or data_str == "[DONE]":
                    continue
                try:
                    chunk = json.loads(data_str)
                except json.JSONDecodeError:
                    continue
                candidates = chunk.get("candidates", [])
                if not candidates:
                    continue
                if meta is not None and candidates[0].get("finishReason"):
                    meta["finish_reason"] = candidates[0]["finishReason"]
                parts = candidates[0].get("content", {}).get("parts", [])
                for p in parts:
                    token_text = p.get("text", "")
                    if token_text:
                        yield token_text


async def _generate_gemini(
    prompt: str,
    api_key: str,
    model: str,
    temperature: float,
    max_tokens: int,
    timeout: float,
    json_mode: bool = False,
    system_prompt: Optional[str] = None,
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
    if system_prompt:
        payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}
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
    system_prompt: Optional[str] = None,
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
    if system_prompt:
        body["system"] = system_prompt
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(f"{base_url}/api/generate", json=body)
        resp.raise_for_status()
        data = resp.json()
    return str(data.get("response", "")).strip()


async def generate_text(
    prompt: str,
    settings,
    *,
    system_prompt: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    timeout: float = 60.0,
    json_mode: bool = False,
    usage: Optional[dict] = None,
) -> str:
    """Generate text from the configured LLM with automatic fallback to Ollama.

    Set json_mode=True when the prompt asks for a JSON object — both providers are
    then constrained to emit valid JSON (much more reliable parsing). Leave it
    False for free-form prose (e.g. Q&A answers).

    Pass a dict as `usage` to learn which provider/model actually produced the
    text: on success it is filled with {"provider": ..., "model": ...}; if every
    provider failed it is left as {"provider": "none", "model": None}. Lets the
    caller log a single definitive "content generated by X" line.
    """
    if usage is not None:
        usage["provider"], usage["model"] = "none", None

    provider = (settings.llm_provider or "ollama").lower()

    # Vertex first when selected; on any failure fall through to the AI Studio keys.
    if provider == "vertex":
        text = await _try_vertex_generate(
            prompt, settings,
            system_prompt=system_prompt, temperature=temperature,
            max_tokens=max_tokens, timeout=timeout, json_mode=json_mode,
        )
        if text:
            if usage is not None:
                usage["provider"], usage["model"] = "vertex", settings.gemini_model
            return text
        print("[LLM] Vertex unavailable/empty — falling back to Gemini API keys")

    keys = settings.gemini_keys
    if provider in ("gemini", "vertex") and keys:
        global _key_cursor
        n = len(keys)
        start = _key_cursor % n
        print(f"[LLM] Using Gemini model: {settings.gemini_model} ({n} key(s), temp={temperature}, max_tokens={max_tokens})")
        # Round-robin across all keys, skipping to the next on rate-limit/error so a
        # single exhausted free-tier key doesn't drop us to Ollama prematurely.
        for offset in range(n):
            idx = (start + offset) % n
            try:
                text = await _generate_gemini(
                    prompt,
                    keys[idx],
                    settings.gemini_model,
                    temperature,
                    max_tokens,
                    timeout,
                    json_mode=json_mode,
                    system_prompt=system_prompt,
                )
                if text:
                    _key_cursor = (idx + 1) % n  # next request starts at the following key
                    print(f"[LLM] Gemini key {idx + 1}/{n} responded OK ({len(text)} chars)")
                    if usage is not None:
                        usage["provider"], usage["model"] = "gemini", settings.gemini_model
                    return text
                print(f"[LLM] Gemini key {idx + 1}/{n} returned empty — trying next key")
            except Exception as e:
                msg = str(e).lower()
                rate = "429" in msg or "quota" in msg or "rate" in msg or "resource_exhausted" in msg
                print(f"[LLM] Gemini key {idx + 1}/{n} {'rate-limited' if rate else 'error'} ({type(e).__name__}) — trying next key")
        _key_cursor = (start + 1) % n
        print(f"[LLM] All {n} Gemini key(s) exhausted — falling back to Ollama")
    else:
        print(f"[LLM] Skipping Gemini (provider={provider!r}, keys={len(keys)}) — going straight to Ollama")

    print(f"[LLM] Using Ollama model: {settings.ollama_model} at {settings.ollama_base_url}")
    try:
        text = await _generate_ollama(
            prompt,
            settings.ollama_base_url,
            settings.ollama_model,
            temperature,
            max_tokens,
            timeout,
            json_mode=json_mode,
            system_prompt=system_prompt,
        )
        print(f"[LLM] Ollama ({settings.ollama_model}) responded OK ({len(text)} chars)")
        if usage is not None:
            usage["provider"], usage["model"] = "ollama", settings.ollama_model
        return text
    except Exception as e:
        print(f"[LLM] Ollama fallback also failed: {e}")
        return ""


async def _stream_gemini(
    prompt: str,
    api_key: str,
    model: str,
    temperature: float,
    max_tokens: int,
    timeout: float,
    json_mode: bool = False,
    system_prompt: Optional[str] = None,
    meta: Optional[dict] = None,
):
    """Async generator yielding text tokens from Gemini's SSE streaming endpoint.

    Raises BEFORE the first yield if the key errors / is rate-limited (so the
    caller can rotate to the next key). Once a token has been yielded the stream
    is committed — a later break is surfaced to the caller, not retried.

    If `meta` is provided, its "finish_reason" is set to the candidate's
    finishReason seen on the stream (None if the server closed early without
    one). The caller uses this to tell a complete answer (STOP / MAX_TOKENS)
    apart from one truncated by a mid-stream drop or rate-limit.
    """
    url = f"{GEMINI_BASE}/{model}:streamGenerateContent?alt=sse&key={api_key}"
    generation_config = {
        "temperature": temperature,
        "maxOutputTokens": max_tokens,
        "topP": 0.9,
        "thinkingConfig": {"thinkingBudget": 0},
    }
    if json_mode:
        generation_config["responseMimeType"] = "application/json"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": generation_config,
    }
    if system_prompt:
        payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}
    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", url, json=payload) as resp:
            if resp.status_code != 200:
                body = (await resp.aread()).decode("utf-8", "ignore")
                raise httpx.HTTPStatusError(
                    f"{resp.status_code}: {body[:300]}", request=resp.request, response=resp
                )
            async for line in resp.aiter_lines():
                if not line or not line.startswith("data:"):
                    continue
                data_str = line[len("data:"):].strip()
                if not data_str or data_str == "[DONE]":
                    continue
                try:
                    chunk = json.loads(data_str)
                except json.JSONDecodeError:
                    continue
                candidates = chunk.get("candidates", [])
                if not candidates:
                    continue
                if meta is not None and candidates[0].get("finishReason"):
                    meta["finish_reason"] = candidates[0]["finishReason"]
                parts = candidates[0].get("content", {}).get("parts", [])
                for p in parts:
                    token = p.get("text", "")
                    if token:
                        yield token


async def _stream_ollama(
    prompt: str,
    base_url: str,
    model: str,
    temperature: float,
    max_tokens: int,
    timeout: float,
    json_mode: bool = False,
    system_prompt: Optional[str] = None,
):
    """Async generator yielding text tokens from Ollama's streaming /api/generate."""
    body = {
        "model": model,
        "prompt": prompt,
        "stream": True,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            "num_ctx": max(8192, max_tokens + 2048),
            "top_p": 0.9,
        },
    }
    if json_mode:
        body["format"] = "json"
    if system_prompt:
        body["system"] = system_prompt
    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", f"{base_url}/api/generate", json=body) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line:
                    continue
                try:
                    chunk = json.loads(line)
                except json.JSONDecodeError:
                    continue
                token = chunk.get("response", "")
                if token:
                    yield token
                if chunk.get("done"):
                    break


async def generate_text_stream(
    prompt: str,
    settings,
    *,
    system_prompt: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    timeout: float = 120.0,
    json_mode: bool = False,
    status: Optional[dict] = None,
):
    """Stream text tokens with the SAME Gemini-first / Ollama-fallback policy as
    generate_text, but yielding tokens as they arrive (for SSE endpoints).

    Rotation to the next Gemini key (then to Ollama) only happens BEFORE the first
    token of an attempt — once tokens start flowing we commit to that stream to
    avoid emitting duplicated text.

    If `status` is provided, status["complete"] is set True only when a stream
    finishes cleanly (Gemini finishReason STOP/MAX_TOKENS, or Ollama done). It
    stays False when a committed stream is cut off mid-answer (rate-limit /
    dropped connection), so the caller can repair the truncated text instead of
    presenting it as final.
    """
    if status is not None:
        status["complete"] = False
        status["finish_reason"] = None

    provider = (settings.llm_provider or "ollama").lower()

    # Vertex first when selected; fall through to the AI Studio keys if it fails
    # before producing a token (once tokens flow we commit to that stream).
    if provider == "vertex":
        project = _resolve_vertex_project(settings)
        location = (getattr(settings, "vertex_location", "") or "us-central1").strip()
        token = await asyncio.to_thread(_load_vertex_token_sync, settings)
        if project and token:
            produced = False
            meta: dict = {}
            try:
                print(f"[LLM-stream] Using Vertex AI: {settings.gemini_model} (project={project}, {location})")
                async for tok in _stream_vertex(
                    prompt, token, project, location, settings.gemini_model,
                    temperature, max_tokens, timeout, json_mode=json_mode,
                    system_prompt=system_prompt, meta=meta,
                ):
                    produced = True
                    yield tok
                if produced:
                    fr = meta.get("finish_reason")
                    if status is not None:
                        status["complete"], status["finish_reason"] = fr in ("STOP", "MAX_TOKENS"), fr
                    print(f"[LLM-stream] Vertex streamed (finish={fr})")
                    return
                print("[LLM-stream] Vertex produced nothing — falling back to Gemini API keys")
            except Exception as e:
                if produced:
                    print(f"[LLM-stream] Vertex broke mid-stream: {e}")
                    return
                print(f"[LLM-stream] Vertex error ({type(e).__name__}) — falling back to Gemini API keys")
        else:
            print("[LLM-stream] Vertex not ready — falling back to Gemini API keys")

    keys = settings.gemini_keys

    if provider in ("gemini", "vertex") and keys:
        global _key_cursor
        n = len(keys)
        start = _key_cursor % n
        print(f"[LLM-stream] Using Gemini model: {settings.gemini_model} ({n} key(s), temp={temperature})")
        for offset in range(n):
            idx = (start + offset) % n
            produced = False
            meta: dict = {}
            try:
                async for token in _stream_gemini(
                    prompt, keys[idx], settings.gemini_model,
                    temperature, max_tokens, timeout, json_mode=json_mode,
                    system_prompt=system_prompt, meta=meta,
                ):
                    produced = True
                    yield token
                if produced:
                    _key_cursor = (idx + 1) % n
                    fr = meta.get("finish_reason")
                    complete = fr in ("STOP", "MAX_TOKENS")
                    if status is not None:
                        status["complete"], status["finish_reason"] = complete, fr
                    print(f"[LLM-stream] Gemini key {idx + 1}/{n} streamed {'OK' if complete else 'INCOMPLETE'} (finish={fr})")
                    return
                print(f"[LLM-stream] Gemini key {idx + 1}/{n} produced nothing — trying next key")
            except Exception as e:
                if produced:
                    # Already emitted tokens — cannot safely restart on another
                    # key/Ollama without duplicating output. End the stream here.
                    print(f"[LLM-stream] Gemini key {idx + 1}/{n} broke mid-stream: {e}")
                    return
                msg = str(e).lower()
                rate = "429" in msg or "quota" in msg or "rate" in msg or "resource_exhausted" in msg
                print(f"[LLM-stream] Gemini key {idx + 1}/{n} {'rate-limited' if rate else 'error'} ({type(e).__name__}) — trying next key")
        _key_cursor = (start + 1) % n
        print(f"[LLM-stream] All {n} Gemini key(s) exhausted — falling back to Ollama")
    else:
        print(f"[LLM-stream] Skipping Gemini (provider={provider!r}, keys={len(keys)}) — going straight to Ollama")

    print(f"[LLM-stream] Using Ollama model: {settings.ollama_model} at {settings.ollama_base_url}")
    try:
        async for token in _stream_ollama(
            prompt, settings.ollama_base_url, settings.ollama_model,
            temperature, max_tokens, timeout, json_mode=json_mode,
            system_prompt=system_prompt,
        ):
            yield token
        # _stream_ollama only exits its loop on the `done` flag (or no data), so
        # reaching here means the answer finished cleanly.
        if status is not None:
            status["complete"], status["finish_reason"] = True, "ollama_done"
    except Exception as e:
        print(f"[LLM-stream] Ollama fallback also failed: {e}")


def extract_json_object(text: str) -> Optional[dict]:
    """Best-effort JSON extraction from an LLM response that may contain stray prose.

    Long-form Vietnamese/English content from Gemini frequently parses with the
    default strict json.loads ONLY when escaping is perfect. In practice the model
    emits literal newlines/tabs inside string values (control chars), the odd
    trailing comma, or wraps the object in ```json fences. Each of these makes a
    structurally-complete JSON object fail json.loads and silently fall back to the
    hardcoded template. We try progressively more forgiving parses before giving up.
    """
    if not text:
        return None
    s = text.strip()
    # Strip markdown code fences (```json ... ``` or ``` ... ```) if present.
    if s.startswith("```"):
        s = re.sub(r"^```[a-zA-Z0-9]*\s*", "", s)
        s = re.sub(r"\s*```$", "", s).strip()
    start, end = s.find("{"), s.rfind("}") + 1
    if start < 0 or end <= start:
        return None
    candidate = s[start:end]
    # 1) strict, 2) strict=False (tolerates literal control chars inside strings —
    #    the most common cause of "complete but unparseable" Gemini output).
    for kwargs in ({}, {"strict": False}):
        try:
            return json.loads(candidate, **kwargs)
        except json.JSONDecodeError:
            pass
    # 3) drop trailing commas before a closing } or ], then retry leniently.
    repaired = re.sub(r",(\s*[}\]])", r"\1", candidate)
    try:
        return json.loads(repaired, strict=False)
    except json.JSONDecodeError:
        return None

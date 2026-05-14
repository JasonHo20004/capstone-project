"""
Image search service — fetches royalty-free images from Pexels for slide visuals.

Returns an empty string if the key is missing, query is empty, or the
request fails (graceful degradation — slides render fine without an image).
"""

import asyncio
import httpx


PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"


async def fetch_image_url(query: str, api_key: str, *, orientation: str = "landscape") -> str:
    """Return a single Pexels image URL matching `query`, or ''."""
    query = (query or "").strip()
    if not query or not api_key:
        return ""

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                PEXELS_SEARCH_URL,
                params={"query": query, "per_page": 1, "orientation": orientation},
                headers={"Authorization": api_key},
            )
            if resp.status_code != 200:
                return ""
            data = resp.json()
    except Exception as e:
        print(f"[Pexels] fetch error for '{query}': {e}")
        return ""

    photos = data.get("photos", [])
    if not photos:
        return ""
    src = photos[0].get("src", {})
    # Prefer "large" (max 940px wide), fallback to other sizes
    return src.get("large") or src.get("medium") or src.get("original") or ""


async def fetch_images_for_queries(queries: list[str], api_key: str) -> list[str]:
    """Fetch images for multiple queries in parallel. Returns same-length list."""
    if not api_key:
        return ["" for _ in queries]
    return await asyncio.gather(*(fetch_image_url(q, api_key) for q in queries))

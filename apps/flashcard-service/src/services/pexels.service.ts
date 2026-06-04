// Pexels Video API — fetch a short clip URL for a given vocabulary word.
// API docs: https://www.pexels.com/api/documentation/#videos-search
// Free tier: 200 req/hour, 20,000 req/month

export async function fetchPexelsVideoUrl(query: string): Promise<string | null> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
  if (!PEXELS_API_KEY) return null;

  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&size=small&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn(`[Pexels] ${res.status} for query "${query}"`);
      return null;
    }

    const data = await res.json() as any;
    const video = data.videos?.[0];
    if (!video) return null;

    // Prefer SD (360/480p) for fast loading; fallback to any file
    const files: any[] = video.video_files ?? [];
    const preferred =
      files.find((f) => f.quality === "sd" && f.height <= 480) ??
      files.find((f) => f.height <= 720) ??
      files[0];

    return preferred?.link ?? null;
  } catch (err) {
    console.warn(`[Pexels] fetch failed for "${query}":`, err);
    return null;
  }
}

import { samplePairs } from "./sample-pairs";

// GET /api/zempled/preview?track=<Deezer id>: returns the address of a song's 30-second preview.
// Deezer's preview addresses expire, so they are looked up when needed instead of being stored.

const allowedTrackIds = new Set(samplePairs.flatMap((pair) => [pair.original.id, pair.sampled.id]));

export async function GET(request: Request) {
  // Only songs in the collection can be looked up, so this route cannot be used to query Deezer freely.
  const trackId = Number(new URL(request.url).searchParams.get("track"));
  if (!allowedTrackIds.has(trackId)) {
    return Response.json({ error: "Unknown track" }, { status: 404 });
  }

  try {
    const response = await fetch(`https://api.deezer.com/track/${trackId}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Catalog unavailable");

    const track = await response.json();
    const preview = new URL(track.preview);
    // The browser is only allowed to play audio from Deezer's own media host (see the CSP).
    if (preview.protocol !== "https:" || !preview.hostname.endsWith(".dzcdn.net")) {
      throw new Error("No preview");
    }

    return Response.json({ preview: preview.href }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Preview unavailable. Try one of the listening links." },
      { status: 502 },
    );
  }
}

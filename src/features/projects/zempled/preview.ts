import { samplePairs } from "@/features/projects/zempled/sample-pairs";

const allowed = new Set(samplePairs.flatMap(pair => [pair.original.id, pair.sampled.id]));

export async function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("track"));
  if (!allowed.has(id)) return Response.json({ error: "Unknown track" }, { status: 404 });
  try {
    const response = await fetch(`https://api.deezer.com/track/${id}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Catalog unavailable");
    const track = await response.json();
    const preview = new URL(track.preview);
    if (preview.protocol !== "https:" || !preview.hostname.endsWith(".dzcdn.net")) throw new Error("No preview");
    return Response.json({ preview: preview.href }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Preview unavailable. Try one of the listening links." }, { status: 502 });
  }
}

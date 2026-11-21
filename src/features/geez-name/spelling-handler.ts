import { createRateLimiter } from "@/features/notifications/rate-limit";
import { clientAddress } from "@/features/notifications/request-checks";
import { googleSpeech, googleSpellings, googleTranslation } from "./google-spelling";

// GET /api/geez-names/spell?name=Aster Aweke  →  { words: [["አስቴር", ...], ["አወቀ", ...]] }
//   Each word's spellings, best first: Google Translate's, then Google's Amharic keyboard's.
// GET /api/geez-names/say?text=አስቴር አወቀ     →  the name spoken in Amharic (MP3); &slow=1 for slower
// Names are passed through to Google and back; nothing is stored or logged.

const NAME_MAX = 40;
const MAX_WORDS = 4;
const LATIN_NAME = /^[A-Za-z][A-Za-z' -]*$/;
const GEEZ_TEXT = /^[ሀ-፿ ]+$/;

const spellPerVisitor = createRateLimiter({ limit: 40, windowMs: 10 * 60 * 1000 });
const sayPerVisitor = createRateLimiter({ limit: 40, windowMs: 10 * 60 * 1000 });

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function spellName(request: Request) {
  if (!spellPerVisitor.allow(clientAddress(request))) return reply(429, { error: "Slow down a little." });

  const name = new URL(request.url).searchParams.get("name")?.trim() ?? "";
  if (!name || name.length > NAME_MAX || !LATIN_NAME.test(name)) {
    return reply(400, { error: "Type a name in English letters." });
  }

  const words = name.replace(/'/g, "").split(/[\s-]+/).filter(Boolean).slice(0, MAX_WORDS);
  const [translation, keyboard] = await Promise.all([
    googleTranslation(words),
    Promise.all(words.map((word) => googleSpellings(word))),
  ]);

  const spellings = words.map((_, index) => {
    const translated = translation?.[index];
    return [...new Set([...(translated ? [translated] : []), ...keyboard[index]])];
  });
  return reply(200, { words: spellings });
}

export async function sayName(request: Request) {
  if (!sayPerVisitor.allow(clientAddress(request))) return reply(429, { error: "Slow down a little." });

  const text = new URL(request.url).searchParams.get("text")?.trim() ?? "";
  if (!text || text.length > NAME_MAX || !GEEZ_TEXT.test(text)) return reply(400, { error: "Nothing to say." });

  const slow = new URL(request.url).searchParams.get("slow") === "1";
  const audio = await googleSpeech(text, slow);
  if (!audio) return reply(502, { error: "The voice isn't available right now." });

  // The same name always sounds the same, so browsers may keep it for a day.
  return new Response(audio, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" },
  });
}

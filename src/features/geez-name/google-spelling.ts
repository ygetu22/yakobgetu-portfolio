// Spelling and saying names with Google's Amharic tools, called from the server.
//
// These are the free endpoints behind Google Translate (its text and its speaker button) and
// Google's Amharic keyboard (Input Tools). They need no key, but they are not an official API: Google can
// change or limit them at any time. Every caller therefore has a fallback (the site's own
// spelling rules in transliterate.ts, and no voice), and the result is never stored.

const TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";
const INPUT_TOOLS_URL = "https://inputtools.google.com/request";
const SPEECH_URL = "https://translate.google.com/translate_tts";
const ETHIOPIC_ONLY = /^[ሀ-፿]+$/;
const TIMEOUT_MS = 4000;

// Google Translate's Amharic for a whole name, one entry per word, or null for a word it left in
// English letters (it does that with many Ethiopian names, which the keyboard spells better).
// Null overall when Google cannot be reached or the words do not line up.
export async function googleTranslation(words: string[]): Promise<(string | null)[] | null> {
  const url = new URL(TRANSLATE_URL);
  url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: "am", dt: "t", q: words.join(" ") }).toString();

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!response.ok) return null;
    // Shape: [[[translated, original, ...], ...], ...]
    const data = (await response.json()) as [[string, string][]];
    const translated = data[0].map((part) => part[0]).join("").trim().split(/\s+/);
    if (translated.length !== words.length) return null;
    return translated.map((word) => (ETHIOPIC_ONLY.test(word) ? word : null));
  } catch {
    return null;
  }
}

// Up to `limit` Ge'ez spellings for one word typed in English letters, best first.
// Empty when Google has none or cannot be reached.
export async function googleSpellings(word: string, limit = 4): Promise<string[]> {
  const url = new URL(INPUT_TOOLS_URL);
  url.search = new URLSearchParams({
    text: word,
    itc: "am-t-i0-und",
    num: String(limit),
    cp: "0",
    cs: "1",
    ie: "utf-8",
    oe: "utf-8",
  }).toString();

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!response.ok) return [];
    // Shape: ["SUCCESS", [[typed, [spelling, ...], ...]]]
    const data = (await response.json()) as [string, [string, string[]][]];
    if (data[0] !== "SUCCESS") return [];
    // Only spellings that are entirely Ge'ez; Google leaves words it does not know in English letters.
    return (data[1]?.[0]?.[1] ?? []).filter((spelling) => ETHIOPIC_ONLY.test(spelling));
  } catch {
    return [];
  }
}

// Amharic speech for a short Ge'ez text as MP3 bytes, or null when Google cannot be reached.
// Google offers one voice, at normal speed or slowed down.
export async function googleSpeech(text: string, slow: boolean): Promise<ArrayBuffer | null> {
  const url = new URL(SPEECH_URL);
  url.search = new URLSearchParams({
    ie: "UTF-8",
    tl: "am",
    client: "tw-ob",
    ttsspeed: slow ? "0.3" : "1",
    q: text,
  }).toString();

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("audio/")) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

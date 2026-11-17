// Checks shared by the routes that accept input from visitors (contact form, journal reactions).

// True when the request was sent by a page of this same site. Browsers always attach Origin to
// a POST made by fetch, so a missing or foreign Origin means the request did not come from the form.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// The visitor's address as reported by the hosting proxy; used only to count requests.
export function clientAddress(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0].trim() || "unknown";
}

// Reads a JSON body no larger than `maxBytes`. Returns null for anything bigger or not JSON.
export async function readSmallJson(request: Request, maxBytes: number): Promise<unknown | null> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) return null;

  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > maxBytes) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

import { readLimitedBody } from "./server-policy";

const checker = "http://127.0.0.1:3120";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

function error(message: string, status: number) {
  return Response.json({ error: message }, { status, headers });
}

// This bridge is intentionally available only to a loopback development server.
// The checker owns quota and uses its socket IP, never forwarded client headers.
function localRequest(request: Request) {
  if (process.env.NODE_ENV !== "development") return false;
  try {
    const host = request.headers.get("host");
    const origin = new URL(`http://${host}`);
    return ["127.0.0.1", "localhost"].includes(origin.hostname) &&
      (!request.headers.get("origin") || request.headers.get("origin") === origin.origin) &&
      request.headers.get("sec-fetch-site") !== "cross-site";
  } catch { return false; }
}

async function forward(request: Request, capture: boolean) {
  if (!localRequest(request)) return error("Live checks are available only in local development. Public checks are not enabled.", 403);
  let body: string | undefined;
  if (capture) {
    if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return error("Use application/json.", 415);
    try { body = await readLimitedBody(request, 4096); }
    catch { return error("The request is too large or could not be read.", 400); }
  }
  try {
    const response = await fetch(`${checker}/api/${capture ? "captures" : "usage"}`, {
      method: capture ? "POST" : "GET",
      headers: capture ? { "Content-Type": "application/json", Origin: checker } : undefined,
      body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(95_000)]),
    });
    const text = await readLimitedBody(response, capture ? 2 * 1024 * 1024 : 4096);
    return new Response(text, { status: response.status, headers: {
      ...headers,
      "Content-Type": "application/json",
      ...(response.headers.has("retry-after") ? { "Retry-After": response.headers.get("retry-after")! } : {}),
    } });
  } catch {
    return error("The local Trace checker is unavailable. Restart npm run dev in your portfolio using Node 22.", 503);
  }
}

export const startBasicCheck = (request: Request) => forward(request, true);
export const getBasicUsage = (request: Request) => forward(request, false);

import { createRateLimiter } from "@/features/notifications/rate-limit";
import { clientAddress, isSameOrigin } from "@/features/notifications/request-checks";
import { runCommands } from "@/features/storage/redis";

// GET  /api/geez-names  how many names have been written in Ge'ez on the site
// POST /api/geez-names  adds one to that count
// Only the number is kept; the names people type never leave their browser.

const COUNT_KEY = "geez-names:count";
const perVisitor = createRateLimiter({ limit: 30, windowMs: 10 * 60 * 1000 });

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function getCount() {
  const results = await runCommands([["GET", COUNT_KEY]]);
  if (!results) return reply(503, { error: "The counter is off." });
  return reply(200, { count: Number(results[0] ?? 0) });
}

export async function addOne(request: Request) {
  if (!isSameOrigin(request)) return reply(403, { error: "Only the site can add to the count." });
  if (!perVisitor.allow(clientAddress(request))) return reply(429, { error: "Slow down a little." });

  const results = await runCommands([["INCR", COUNT_KEY]]);
  if (!results) return reply(503, { error: "The counter is off." });
  return reply(200, { count: Number(results[0]) });
}

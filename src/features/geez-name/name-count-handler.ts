import { createHmac } from "node:crypto";
import { createRateLimiter } from "@/features/notifications/rate-limit";
import { clientAddress, isSameOrigin } from "@/features/notifications/request-checks";
import { runCommands } from "@/features/storage/redis";

// GET  /api/geez-names  how many devices have written a name in Ge'ez on the site
// POST /api/geez-names  counts this device, once; trying more names does not add to the count
//
// The names people type are never stored. To recognise a device that was already counted, the
// server keeps a one-way fingerprint of its IP address (an HMAC), not the address itself.
// Devices that share an address (a school or office network) count as one, which is fine here.

const COUNT_KEY = "geez-names:count";
const COUNTED_DEVICES_KEY = "geez-names:devices";
const perVisitor = createRateLimiter({ limit: 30, windowMs: 10 * 60 * 1000 });

// Adds the device to the set and, only if it was not there yet, adds one to the count.
// Runs inside Redis in one step, so two requests at once cannot both count the same device.
const COUNT_ONCE_SCRIPT = `
if redis.call("SADD", KEYS[1], ARGV[1]) == 1 then
  return redis.call("INCR", KEYS[2])
end
return tonumber(redis.call("GET", KEYS[2]) or "0")
`;

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// The database token is already a server-only secret, so it doubles as the fingerprint key:
// without it, a fingerprint cannot be matched back to an address.
function deviceFingerprint(address: string): string | null {
  const secret = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!secret) return null;
  return createHmac("sha256", secret).update(`geez-names:${address}`).digest("hex");
}

export async function getCount() {
  const results = await runCommands([["GET", COUNT_KEY]]);
  if (!results) return reply(503, { error: "The counter is off." });
  return reply(200, { count: Number(results[0] ?? 0) });
}

export async function addOne(request: Request) {
  if (!isSameOrigin(request)) return reply(403, { error: "Only the site can add to the count." });
  if (!perVisitor.allow(clientAddress(request))) return reply(429, { error: "Slow down a little." });

  const fingerprint = deviceFingerprint(clientAddress(request));
  if (!fingerprint) return reply(503, { error: "The counter is off." });

  const results = await runCommands([["EVAL", COUNT_ONCE_SCRIPT, 2, COUNTED_DEVICES_KEY, COUNT_KEY, fingerprint]]);
  if (!results) return reply(503, { error: "The counter is off." });
  return reply(200, { count: Number(results[0]) });
}

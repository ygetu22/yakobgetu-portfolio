// A small in-memory rate limiter: at most `limit` actions per key within `windowMs`.
//
// It lives in the memory of one server process. On serverless hosting each instance keeps its
// own count and forgets it when it stops, so this slows a burst down but is not a hard
// guarantee. See docs/CONTACT_FORM.md for what to add if spam ever gets through.

// Old keys are dropped once this many are being tracked, so memory use stays bounded.
const MAX_TRACKED_KEYS = 5000;

type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  // Replaceable clock, so tests do not have to wait.
  now?: () => number;
};

export type RateLimiter = { allow: (key: string) => boolean };

export function createRateLimiter({ limit, windowMs, now = Date.now }: RateLimiterOptions): RateLimiter {
  const timesByKey = new Map<string, number[]>();

  return {
    // Records one action for `key` and says whether it is within the limit.
    allow(key) {
      const windowStart = now() - windowMs;
      const recent = (timesByKey.get(key) ?? []).filter((time) => time > windowStart);
      if (recent.length >= limit) {
        timesByKey.set(key, recent);
        return false;
      }

      recent.push(now());
      // Re-insert so the map stays ordered from least to most recently active.
      timesByKey.delete(key);
      timesByKey.set(key, recent);

      if (timesByKey.size > MAX_TRACKED_KEYS) {
        const oldestKey = timesByKey.keys().next().value;
        if (oldestKey !== undefined) timesByKey.delete(oldestKey);
      }
      return true;
    },
  };
}

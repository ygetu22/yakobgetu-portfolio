// Talks to the site's Upstash Redis database over its REST API (https://upstash.com/docs/redis/features/restapi).
// Plain fetch, so no client library is needed.
//
// Server only. The address and token come from the environment variables that the Upstash
// integration adds in Vercel (KV_REST_API_URL / KV_REST_API_TOKEN); the token must never reach
// the browser. Without them, every call returns null and the features that need it say they are off.

type Command = (string | number)[];

function connection() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function isStorageConfigured(): boolean {
  return connection() !== null;
}

// Runs the commands in order in one request and returns each one's result,
// or null when storage is not configured or cannot be reached.
export async function runCommands(commands: Command[]): Promise<unknown[] | null> {
  const target = connection();
  if (!target) return null;

  try {
    const response = await fetch(`${target.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${target.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const results = (await response.json()) as { result?: unknown; error?: string }[];
    if (results.some((item) => item.error)) return null;
    return results.map((item) => item.result);
  } catch {
    return null;
  }
}

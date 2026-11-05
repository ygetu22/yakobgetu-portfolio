// Pure policy helpers are kept separate so security boundaries can be tested without Next.
export const runIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const artifactPattern = /^(screenshot\.png|mobile\.png|report\.json|(?:desktop|mobile)-trace\.zip|action-(?:desktop|mobile)-\d{1,2}\.png)$/;

export interface TraceConfig { origin: string; gateway: string; serviceKey: string; siteKey: string; turnstileSecret: string; local: boolean }

export function traceConfig(env: NodeJS.ProcessEnv = process.env): TraceConfig | null {
  const local = env.NODE_ENV !== "production" && env.TRACE_DEMO_MODE === "local";
  if (!local && env.TRACE_DEMO_MODE !== "public") return null;
  try {
    const origin = new URL(env.TRACE_PUBLIC_ORIGIN ?? "http://127.0.0.1:3000");
    const gateway = new URL(env.TRACE_GATEWAY_URL ?? "http://127.0.0.1:3121");
    const serviceKey = env.TRACE_SERVICE_KEY ?? "";
    const siteKey = env.TRACE_TURNSTILE_SITE_KEY ?? "";
    const turnstileSecret = env.TRACE_TURNSTILE_SECRET ?? "";
    if (origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    if (gateway.username || gateway.password || gateway.pathname !== "/" || gateway.search || gateway.hash) return null;
    if (serviceKey.length < 32) return null;
    if (local) {
      if (!["localhost", "127.0.0.1"].includes(origin.hostname) || !["localhost", "127.0.0.1"].includes(gateway.hostname)) return null;
      if (origin.protocol !== "http:" || gateway.protocol !== "http:") return null;
    } else {
      if (origin.protocol !== "https:" || !["yakobgetu.com", "www.yakobgetu.com"].includes(origin.hostname) || origin.port) return null;
      if (gateway.protocol !== "https:" || !siteKey || !turnstileSecret) return null;
    }
    return { origin: origin.origin, gateway: gateway.origin, serviceKey, siteKey, turnstileSecret, local };
  } catch { return null; }
}

export function validCaptureInput(input: unknown): { url: string; featureCheck?: { label: string; expectedText: string }; token: string } {
  if (!input || typeof input !== "object" || !("url" in input) || typeof input.url !== "string" || input.url.length > 2048) throw new Error("Enter a complete public website URL.");
  const url = new URL(input.url.trim());
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port) throw new Error("Use HTTP or HTTPS without credentials or a custom port.");
  let featureCheck;
  if ("featureCheck" in input && input.featureCheck !== undefined) {
    const value = input.featureCheck;
    if (!value || typeof value !== "object" || !("label" in value) || !("expectedText" in value) || typeof value.label !== "string" || typeof value.expectedText !== "string") throw new Error("Enter both a control label and its expected text.");
    const label = value.label.trim();
    const expectedText = value.expectedText.trim();
    if (!label || label.length > 200 || !expectedText || expectedText.length > 500) throw new Error("The feature check is empty or too long.");
    featureCheck = { label, expectedText };
  }
  const token = "token" in input && typeof input.token === "string" ? input.token : "";
  if (token.length > 2048) throw new Error("Verification token is too long.");
  return { url: url.href, featureCheck, token };
}

export async function readLimitedBody(request: Pick<Request, "headers" | "body">, limit = 8192): Promise<string> {
  if (Number(request.headers.get("content-length")) > limit) throw new Error("Request is too large.");
  if (!request.body) throw new Error("Request body is missing.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let expired = false;
  const timeout = setTimeout(() => { expired = true; void reader.cancel().catch(() => {}); }, 5_000);
  try {
    while (true) {
      const next = await reader.read();
      if (expired) throw new Error("Request body took too long.");
      if (next.done) break;
      bytes += next.value.length;
      if (bytes > limit) { await reader.cancel(); throw new Error("Request is too large."); }
      chunks.push(next.value);
    }
  } finally { clearTimeout(timeout); reader.releaseLock(); }
  const contents = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { contents.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(contents);
}

export function artifactUrl(id: string, name: string): string {
  if (!runIdPattern.test(id) || !artifactPattern.test(name)) throw new Error("Invalid evidence path.");
  return `/api/trace/runs/${id}/${name}`;
}

export function validTurnstileResult(result: unknown, hostname: string): boolean {
  return Boolean(result && typeof result === "object" && "success" in result && result.success === true &&
    "hostname" in result && result.hostname === hostname && "action" in result && result.action === "trace-investigation");
}

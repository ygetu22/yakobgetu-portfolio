import { NextResponse, type NextRequest } from "next/server";
import { artifactPattern, artifactUrl, readLimitedBody, runIdPattern, traceConfig, validCaptureInput, validTurnstileResult } from "./server-policy";
import type { TraceReport } from "./types";

const noStore = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };
function error(message: string, status: number) { return NextResponse.json({ error: message }, { status, headers: noStore }); }

export async function startInvestigation(request: NextRequest) {
  const config = traceConfig();
  if (!config) return error("Live investigations are not available yet. You can explore the recorded example.", 503);
  if (request.headers.get("origin") !== config.origin || request.headers.get("sec-fetch-site") === "cross-site") return error("Start investigations from Trace's project page.", 403);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return error("Use application/json.", 415);
  let input;
  try { input = validCaptureInput(JSON.parse(await readLimitedBody(request))); }
  catch (cause) { return error(cause instanceof Error ? cause.message : "Invalid request.", 400); }
  if (!config.local) {
    if (!input.token) return error("Complete the verification first.", 403);
    try {
      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: config.turnstileSecret, response: input.token }),
        signal: AbortSignal.timeout(5_000), redirect: "error", cache: "no-store",
      });
      const verification = await response.json();
      if (!response.ok || !validTurnstileResult(verification, new URL(config.origin).hostname)) return error("Verification failed. Please try again.", 403);
    } catch { return error("Verification is temporarily unavailable.", 503); }
  }
  try {
    const response = await fetch(`${config.gateway}/captures`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.serviceKey}` },
      body: JSON.stringify({ url: input.url, featureCheck: input.featureCheck }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(110_000)]), redirect: "error", cache: "no-store",
    });
    if (!response.ok) {
      const status = [400, 413, 422, 429, 503, 504].includes(response.status) ? response.status : 502;
      return error(status === 429 ? "The demo is busy or has reached its usage limit. Please try later." : "The investigation could not complete. Please try later.", status);
    }
    const saved = JSON.parse(await readLimitedBody(response, 1024 * 1024)) as { report: TraceReport; accessToken: string };
    if (!runIdPattern.test(saved.report.id) || !/^[a-f0-9]{64}$/.test(saved.accessToken)) return error("The investigation returned an invalid result.", 502);
    const report = saved.report;
    report.screenshotUrl = artifactUrl(report.id, "screenshot.png");
    report.mobile.screenshotUrl = artifactUrl(report.id, "mobile.png");
    report.traceUrls = { desktop: artifactUrl(report.id, "desktop-trace.zip"), mobile: artifactUrl(report.id, "mobile-trace.zip") };
    for (const finding of report.findings) {
      if (finding.screenshotUrl) finding.screenshotUrl = artifactUrl(report.id, finding.screenshotUrl.split("/").at(-1)!);
    }
    const result = NextResponse.json(report, { status: 201, headers: noStore });
    result.cookies.set(`trace_${report.id}`, saved.accessToken, {
      httpOnly: true, secure: !config.local, sameSite: "strict", path: `/api/trace/runs/${report.id}`, maxAge: 900,
    });
    return result;
  } catch { return error("Trace is temporarily unavailable. Please try later.", 503); }
}

export async function getEvidence(request: NextRequest, context: { params: Promise<{ id: string; name: string }> }) {
  const config = traceConfig();
  if (!config) return error("Evidence is unavailable.", 404);
  const { id, name } = await context.params;
  if (!runIdPattern.test(id) || !artifactPattern.test(name)) return error("Evidence is unavailable.", 404);
  const token = request.cookies.get(`trace_${id}`)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return error("Evidence is unavailable or expired.", 404);
  if (request.headers.get("sec-fetch-site") === "cross-site") return error("Access denied.", 403);
  try {
    const response = await fetch(`${config.gateway}/runs/${id}/${name}`, {
      headers: { Authorization: `Bearer ${config.serviceKey}`, "X-Trace-Access": token },
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]), redirect: "error", cache: "no-store",
    });
    if (!response.ok) return error("Evidence is unavailable or expired.", 404);
    return new NextResponse(response.body, { headers: {
      ...noStore,
      "Content-Type": name.endsWith(".png") ? "image/png" : name.endsWith(".zip") ? "application/zip" : "application/json",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      ...(name.endsWith(".png") ? {} : { "Content-Disposition": `attachment; filename="${name}"` }),
    } });
  } catch { return error("Evidence is temporarily unavailable.", 503); }
}

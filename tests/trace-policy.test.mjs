import assert from "node:assert/strict";
import test from "node:test";
import { artifactUrl, readLimitedBody, traceConfig, validCaptureInput, validTurnstileResult } from "../src/features/projects/trace/server-policy.ts";
import { contentSecurityPolicy } from "../src/components/security/content-security-policy.ts";

const serviceKey = "test-only-".repeat(5);

test("Turnstile accepts only verified tokens for the exact hostname and action", () => {
  const result = { success: true, hostname: "yakobgetu.com", action: "trace-investigation" };
  assert.equal(validTurnstileResult(result, "yakobgetu.com"), true);
  for (const value of [null, {}, { ...result, success: false }, { ...result, success: "true" }, { ...result, hostname: "evil.example" }, { ...result, action: "other-form" }]) {
    assert.equal(validTurnstileResult(value, "yakobgetu.com"), false);
  }
});

test("production scripts require a nonce and disallow inline script/eval bypasses", () => {
  const policy = contentSecurityPolicy("test-nonce", false);
  const scripts = policy.split(";").find((directive) => directive.trim().startsWith("script-src"));
  assert(scripts.includes("'nonce-test-nonce'"));
  assert(scripts.includes("'strict-dynamic'"));
  assert(!scripts.includes("unsafe-inline"));
  assert(!scripts.includes("unsafe-eval"));
  assert(policy.includes("frame-ancestors 'none'"));
  assert(policy.includes("object-src 'none'"));
});

test("live demo stays off with incomplete or unsafe production configuration", () => {
  assert.equal(traceConfig({}), null);
  assert.equal(traceConfig({ NODE_ENV: "production", TRACE_DEMO_MODE: "local", TRACE_SERVICE_KEY: serviceKey }), null);
  const production = { NODE_ENV: "production", TRACE_DEMO_MODE: "public", TRACE_PUBLIC_ORIGIN: "https://yakobgetu.com", TRACE_GATEWAY_URL: "https://worker.example.com", TRACE_SERVICE_KEY: serviceKey, TRACE_TURNSTILE_SITE_KEY: "public", TRACE_TURNSTILE_SECRET: "private" };
  assert(traceConfig(production));
  for (const change of [{ TRACE_SERVICE_KEY: "" }, { TRACE_TURNSTILE_SECRET: "" }, { TRACE_TURNSTILE_SITE_KEY: "" }, { TRACE_PUBLIC_ORIGIN: "https://evil.example" }, { TRACE_GATEWAY_URL: "http://worker.example.com" }, { TRACE_GATEWAY_URL: "https://user:password@worker.example.com" }]) {
    assert.equal(traceConfig({ ...production, ...change }), null);
  }
  assert(traceConfig({ NODE_ENV: "development", TRACE_DEMO_MODE: "local", TRACE_SERVICE_KEY: serviceKey }));
  assert.equal(traceConfig({ NODE_ENV: "development", TRACE_DEMO_MODE: "local", TRACE_SERVICE_KEY: serviceKey, TRACE_GATEWAY_URL: "http://external.example" }), null);
});

test("capture validation excludes credentials, custom ports, and malformed feature checks", () => {
  assert.equal(validCaptureInput({ url: "https://example.com" }).url, "https://example.com/");
  for (const input of [{ url: "file:///secret" }, { url: "https://key:secret@example.com" }, { url: "https://example.com:8443" }, { url: "https://example.com", featureCheck: { label: "Menu" } }, { url: "https://example.com", token: "a".repeat(2049) }]) assert.throws(() => validCaptureInput(input));
});

test("chunked request bodies cannot bypass input limits", async () => {
  const request = new Request("https://yakobgetu.com/api/trace/captures", { method: "POST", body: "x".repeat(8193) });
  await assert.rejects(readLimitedBody(request), /too large/);
  assert.equal(await readLimitedBody(new Request("https://yakobgetu.com", { method: "POST", body: "{}" })), "{}");
});

test("artifact paths accept only owned IDs and allowlisted filenames", () => {
  const id = "00000000-0000-0000-0000-000000000001";
  assert.equal(artifactUrl(id, "mobile.png"), `/api/trace/runs/${id}/mobile.png`);
  for (const file of ["../secret", "page.html", "https://evil.example", "action-desktop-100.png"]) assert.throws(() => artifactUrl(id, file));
  assert.throws(() => artifactUrl("../secret", "mobile.png"));
});

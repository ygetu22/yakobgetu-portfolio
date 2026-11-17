import assert from "node:assert/strict";
import test from "node:test";
import { contentSecurityPolicy } from "../src/components/security/content-security-policy.ts";

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

test("production policy allows no third-party scripts or frames", () => {
  const policy = contentSecurityPolicy("test-nonce", false);
  assert(!policy.includes("challenges.cloudflare.com"));
  assert(!policy.includes("frame-src"));
});

test("audio may only come from this site, Deezer previews and Spotify preview clips", () => {
  const policy = contentSecurityPolicy("test-nonce", false);
  const media = policy.split(";").find((directive) => directive.trim().startsWith("media-src"));
  assert.equal(media.trim(), "media-src 'self' https://*.dzcdn.net https://p.scdn.co");
});

test("development additions stay out of the production policy", () => {
  const production = contentSecurityPolicy("test-nonce", false);
  assert(!production.includes("ws://"));
  assert(contentSecurityPolicy("test-nonce", true).includes("ws://127.0.0.1:*"));
});

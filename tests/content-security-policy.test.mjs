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

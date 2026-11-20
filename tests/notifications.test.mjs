import assert from "node:assert/strict";
import test from "node:test";
import { createRateLimiter } from "../src/features/notifications/rate-limit.ts";
import { clientAddress, isSameOrigin, readSmallJson } from "../src/features/notifications/request-checks.ts";

function post(headers, body = "{}") {
  return new Request("https://yakobgetu.com/api/contact", { method: "POST", headers, body });
}

test("the limiter blocks a key after its limit and lets it back in when the window passes", () => {
  let time = 0;
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });

  assert.equal(limiter.allow("visitor"), true);
  assert.equal(limiter.allow("visitor"), true);
  assert.equal(limiter.allow("visitor"), false);

  time = 1001;
  assert.equal(limiter.allow("visitor"), true);
});

test("each key is counted on its own", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
  assert.equal(limiter.allow("first"), true);
  assert.equal(limiter.allow("second"), true);
  assert.equal(limiter.allow("first"), false);
});

test("only requests from the site's own pages count as same-origin", () => {
  assert.equal(isSameOrigin(post({ origin: "https://yakobgetu.com", host: "yakobgetu.com" })), true);
  assert.equal(isSameOrigin(post({ origin: "https://evil.example", host: "yakobgetu.com" })), false);
  assert.equal(isSameOrigin(post({ host: "yakobgetu.com" })), false);
  assert.equal(isSameOrigin(post({ origin: "not a url", host: "yakobgetu.com" })), false);
});

test("the forwarded host is preferred, because the proxy rewrites Host", () => {
  const request = post({
    origin: "https://yakobgetu.com",
    host: "internal:3000",
    "x-forwarded-host": "yakobgetu.com",
  });
  assert.equal(isSameOrigin(request), true);
});

test("the visitor address is the first forwarded address", () => {
  assert.equal(clientAddress(post({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" })), "203.0.113.7");
  assert.equal(clientAddress(post({})), "unknown");
});

test("small JSON bodies are read; large or broken ones are refused", async () => {
  assert.deepEqual(await readSmallJson(post({}, '{"name":"Abebe"}'), 100), { name: "Abebe" });
  assert.equal(await readSmallJson(post({}, JSON.stringify({ text: "x".repeat(200) })), 100), null);
  assert.equal(await readSmallJson(post({}, "not json"), 100), null);
});

test("body size is measured in bytes, not characters", async () => {
  // Each Ge'ez letter is three bytes, so 40 letters do not fit in 100 bytes.
  const body = JSON.stringify({ text: "ሀ".repeat(40) });
  assert.equal(await readSmallJson(post({}, body), 100), null);
});

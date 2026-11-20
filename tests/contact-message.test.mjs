import assert from "node:assert/strict";
import test from "node:test";
import {
  HONEYPOT_FIELD,
  contactLimits,
  isHoneypotFilled,
  parseContactMessage,
} from "../src/features/contact/contact-message.ts";

const valid = { name: "Abebe Bikila", email: "abebe@example.com", message: "Hello Yakob" };

test("a complete message is accepted and trimmed", () => {
  const result = parseContactMessage({ ...valid, name: "  Abebe Bikila  " });
  assert.deepEqual(result, { ok: true, message: valid });
});

test("each missing field gets its own error", () => {
  const result = parseContactMessage({});
  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ["email", "message", "name"]);
});

test("input that is not an object is refused instead of crashing", () => {
  for (const input of [null, "text", 42, ["a"]]) {
    assert.equal(parseContactMessage(input).ok, false);
  }
});

test("malformed email addresses are refused", () => {
  for (const email of ["abebe", "abebe@", "@example.com", "abebe@example", "a b@example.com"]) {
    const result = parseContactMessage({ ...valid, email });
    assert.equal(result.ok, false, email);
    assert(result.errors.email);
  }
});

test("line breaks cannot be smuggled into the name or email", () => {
  // These two fields end up in the notification email's subject and reply-to.
  const result = parseContactMessage({ ...valid, name: "Abebe\r\nBcc: someone@example.com" });
  assert.equal(result.ok, true);
  assert.equal(/[\r\n]/.test(result.message.name), false);

  assert.equal(parseContactMessage({ ...valid, email: "abebe@example.com\nbcc@example.com" }).ok, false);
});

test("the message keeps its line breaks", () => {
  const result = parseContactMessage({ ...valid, message: "Hi,\n\nSecond paragraph." });
  assert.equal(result.message.message, "Hi,\n\nSecond paragraph.");
});

test("fields over their limits are refused", () => {
  assert.equal(parseContactMessage({ ...valid, name: "a".repeat(contactLimits.name + 1) }).ok, false);
  assert.equal(parseContactMessage({ ...valid, message: "a".repeat(contactLimits.message + 1) }).ok, false);
  assert.equal(parseContactMessage({ ...valid, message: "a".repeat(contactLimits.message) }).ok, true);
});

test("a filled hidden field marks the message as automated", () => {
  assert.equal(isHoneypotFilled({ ...valid, [HONEYPOT_FIELD]: "https://spam.example" }), true);
  assert.equal(isHoneypotFilled({ ...valid, [HONEYPOT_FIELD]: "  " }), false);
  assert.equal(isHoneypotFilled(valid), false);
  assert.equal(isHoneypotFilled(null), false);
});

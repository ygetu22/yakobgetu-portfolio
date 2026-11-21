import assert from "node:assert/strict";
import { test } from "node:test";
import { checkComment, isHoneypotFilled } from "../src/features/posts/post-comment.ts";

test("accepts a normal comment and tidies the spacing", () => {
  const result = checkComment({ name: "  Abel   T ", text: "Congrats!\n\n\n\nLooks great." });
  assert.deepEqual(result, { ok: true, comment: { name: "Abel T", text: "Congrats!\n\nLooks great." } });
});

test("refuses empty, too long, and non-text input", () => {
  assert.equal(checkComment({ name: "", text: "hi" }).ok, false);
  assert.equal(checkComment({ name: "A", text: "   " }).ok, false);
  assert.equal(checkComment({ name: "A", text: "x".repeat(501) }).ok, false);
  assert.equal(checkComment({ name: "x".repeat(41), text: "hi" }).ok, false);
  assert.equal(checkComment({ name: 5, text: "hi" }).ok, false);
  assert.equal(checkComment(null).ok, false);
});

test("refuses links, which are how spam usually looks", () => {
  for (const text of ["see https://spam.example", "go to www.spam", "visit cheap-stuff.xyz now"]) {
    assert.equal(checkComment({ name: "Bot", text }).ok, false, text);
  }
});

test("refuses blocked words only as whole words", () => {
  assert.equal(checkComment({ name: "A", text: "best casino deals" }).ok, false);
  assert.equal(checkComment({ name: "A", text: "the skys the limit" }).ok, true);
});

test("spots the hidden field bots fill in", () => {
  assert.equal(isHoneypotFilled({ website: "http://x" }), true);
  assert.equal(isHoneypotFilled({ website: "" }), false);
  assert.equal(isHoneypotFilled({}), false);
});

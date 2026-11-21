import assert from "node:assert/strict";
import { test } from "node:test";
import { transliterateName } from "../src/features/geez-name/transliterate.ts";

const write = (name) => transliterateName(name).map((word) => word.map((letter) => letter.glyph).join("")).join(" ");

test("writes common names by sound", () => {
  assert.equal(write("Sarah"), "ሳራ");
  assert.equal(write("Daniel"), "ዳኒኤል");
  assert.equal(write("Yakob"), "ያኮብ");
  assert.equal(write("Abel"), "አቤል");
  assert.equal(write("Anna"), "አና");
});

test("handles two-letter sounds, soft c and silent letters", () => {
  assert.equal(write("Shane"), "ሻን");
  assert.equal(write("Chris"), "ችሪስ");
  assert.equal(write("Grace"), "ግራስ");
  assert.equal(write("Andy"), "አንዲ");
  assert.equal(write("Max"), "ማክስ");
});

test("lets vowels glide and reads a final ey as i", () => {
  assert.equal(write("Wesley Kamau"), "ዌስሊ ካማው");
  assert.equal(write("Joshua"), "ጆሹዋ");
  assert.equal(write("Maria"), "ማሪያ");
});

test("keeps each word and ignores what is not a letter", () => {
  assert.equal(write("  mary-jane   o'neil "), "ማሪጃን ኦኔኢል");
  assert.equal(write("123 !!"), "");
});

test("keeps a name already written in Ge'ez", () => {
  assert.equal(write("ያዕቆብ"), "ያዕቆብ");
});

test("says how each letter sounds", () => {
  assert.deepEqual(transliterateName("Sam")[0], [
    { glyph: "ሳ", sound: "sa" },
    { glyph: "ም", sound: "m" },
  ]);
});

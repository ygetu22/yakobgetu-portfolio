import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { journalChapters } from "../src/features/projects/elsewhere/journal-data.ts";
import { placeChapters } from "../src/features/projects/elsewhere/journal-layout.ts";
import { MAX_COMMENT_LENGTH, parseReaction } from "../src/features/projects/elsewhere/reaction.ts";
import { jpegSize } from "./image-size.mjs";

const allPhotos = journalChapters.flatMap((chapter) => chapter.photos);
const photoIds = allPhotos.map((photo) => photo.id);

test("every journal photo exists and has the size the page reserves for it", () => {
  for (const photo of allPhotos) {
    const file = new URL(`../public${photo.image}`, import.meta.url).pathname;
    assert(existsSync(file), `${photo.image} is missing`);
    assert.deepEqual(jpegSize(file), { width: photo.width, height: photo.height }, photo.image);
  }
});

test("photo ids are unique and every photo is described for screen readers", () => {
  assert.equal(new Set(photoIds).size, photoIds.length);
  for (const photo of allPhotos) {
    assert(photo.alt.length > 20, `${photo.id} needs a real description`);
    assert(photo.place && photo.date, `${photo.id} needs a place and date`);
  }
});

test("quotes name their source and translate anything not in English", () => {
  for (const chapter of journalChapters) {
    if (!chapter.quote) continue;
    assert(chapter.quote.source, `${chapter.id} quote has no source`);
    if (chapter.quote.lang !== "en") assert(chapter.quote.english, `${chapter.id} quote has no translation`);
  }
});

function photo(id, width, height) {
  return { id, place: "", date: "", image: "", width, height, alt: "" };
}

test("photos are numbered across chapters and tall ones alternate sides", () => {
  const placed = placeChapters([
    { id: "one", title: "", when: "", photos: [photo("a", 3, 4), photo("b", 4, 3), photo("c", 3, 4)] },
    { id: "two", title: "", when: "", photos: [photo("d", 3, 4)] },
  ]);

  const flat = placed.flatMap((chapter) => chapter.photos);
  assert.deepEqual(flat.map((entry) => entry.number), [1, 2, 3, 4]);
  // Tall, wide, tall, tall: wide photos never move to the right and do not break the alternation.
  assert.deepEqual(flat.map((entry) => entry.isOnRight), [false, false, true, false]);
  assert.equal(placed[0].isQuoteOnRight, true);
  assert.equal(placed[1].isQuoteOnRight, false);
});

test("an empty chapter does not break the layout", () => {
  const placed = placeChapters([{ id: "empty", title: "", when: "", photos: [] }]);
  assert.deepEqual(placed[0].photos, []);
  assert.equal(placed[0].isQuoteOnRight, false);
});

test("likes and reposts are accepted for known photos only", () => {
  assert.deepEqual(parseReaction({ photoId: "a", kind: "like" }, ["a"]), { photoId: "a", kind: "like" });
  assert.equal(parseReaction({ photoId: "missing", kind: "like" }, ["a"]), null);
  assert.equal(parseReaction({ photoId: "a", kind: "delete" }, ["a"]), null);
  assert.equal(parseReaction("like", ["a"]), null);
});

test("a comment on a like is dropped, so unexpected text never reaches the email", () => {
  const reaction = parseReaction({ photoId: "a", kind: "like", comment: "hidden text" }, ["a"]);
  assert.deepEqual(reaction, { photoId: "a", kind: "like" });
});

test("comments are trimmed and must be between 1 and the maximum length", () => {
  const comment = (text) => parseReaction({ photoId: "a", kind: "comment", comment: text }, ["a"]);

  assert.equal(comment("  beautiful  ").comment, "beautiful");
  assert.equal(comment("   "), null);
  assert.equal(comment(undefined), null);
  assert.equal(comment("x".repeat(MAX_COMMENT_LENGTH + 1)), null);
  assert.notEqual(comment("x".repeat(MAX_COMMENT_LENGTH)), null);
});

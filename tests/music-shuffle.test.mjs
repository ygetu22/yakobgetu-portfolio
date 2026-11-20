import assert from "node:assert/strict";
import test from "node:test";
import { createShuffleQueue } from "../src/features/music/shuffle-queue.ts";

const songs = ["a", "b", "c", "d", "e"];

test("every song plays once before any song repeats", () => {
  const queue = createShuffleQueue(songs);
  for (let round = 0; round < 3; round++) {
    const played = songs.map(() => queue.next());
    assert.deepEqual([...played].sort(), songs);
  }
});

test("a new round never starts with the song that just played", () => {
  const queue = createShuffleQueue(songs);
  let previous = queue.next();
  for (let count = 0; count < 200; count++) {
    const current = queue.next();
    assert.notEqual(current, previous);
    previous = current;
  }
});

test("a single song simply repeats, and an empty list is refused", () => {
  const queue = createShuffleQueue(["only"]);
  assert.equal(queue.next(), "only");
  assert.equal(queue.next(), "only");
  assert.throws(() => createShuffleQueue([]));
});

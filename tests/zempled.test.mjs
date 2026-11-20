import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { profileFor } from "../src/features/projects/zempled/artists.ts";
import {
  randomOtherIndex,
  wrapIndex,
} from "../src/features/projects/zempled/pair-order.ts";
import { samplePairs } from "../src/features/projects/zempled/sample-pairs.ts";

const allTracks = samplePairs.flatMap((pair) => [pair.original, pair.sampled]);

test("every pair says where the sample is documented", () => {
  const ids = samplePairs.map((pair) => pair.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const pair of samplePairs) {
    assert(pair.note.length > 40, `${pair.id} needs a note`);
    assert(pair.source.label, `${pair.id} needs a source`);
    assert.equal(new URL(pair.source.url).protocol, "https:", pair.id);
  }
});

test("every track has its cover file and links to the right services", () => {
  const linkHosts = {
    deezer: "www.deezer.com",
    youtube: "www.youtube.com",
    spotify: "open.spotify.com",
    appleMusic: "music.apple.com",
  };

  for (const track of allTracks) {
    const cover = new URL(`../public${track.cover}`, import.meta.url).pathname;
    assert(existsSync(cover), `${track.cover} is missing`);
    assert.equal(track.deezer, `https://www.deezer.com/track/${track.id}`);

    for (const [service, host] of Object.entries(linkHosts)) {
      if (track[service]) assert.equal(new URL(track[service]).host, host, `${track.title} ${service}`);
    }
  }
});

test("an artist's profile is found from a longer credit", () => {
  assert.equal(profileFor("Hailu Mergia & The Walias").name, "Hailu Mergia");
  assert.equal(profileFor("Mulatu Astatke").name, "Mulatu Astatke");
  assert.equal(profileFor("Someone Else"), undefined);
});

test("moving past either end of the collection wraps around", () => {
  assert.equal(wrapIndex(-1, 19), 18);
  assert.equal(wrapIndex(19, 19), 0);
  assert.equal(wrapIndex(7, 19), 7);
});

test("shuffle always lands on a different pair", () => {
  for (const random of [0, 0.3, 0.5, 0.999]) {
    for (let current = 0; current < 5; current++) {
      const next = randomOtherIndex(current, 5, random);
      assert.notEqual(next, current);
      assert(next >= 0 && next < 5);
    }
  }
  assert.equal(randomOtherIndex(0, 1, 0.5), 0);
});

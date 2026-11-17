// Moving through the collection: wrapping at the ends, shuffling, and the grouped index.
// Plain functions with no imports that run, so the tests can load this file directly.

import type { SamplePair } from "./sample-pairs";

// Going back from the first pair lands on the last one, and forward from the last on the first.
export function wrapIndex(index: number, total: number): number {
  return ((index % total) + total) % total;
}

// Picks a pair other than the current one. `random` is a number from 0 up to (not including) 1.
export function randomOtherIndex(current: number, total: number, random: number): number {
  if (total < 2) return current;
  const stepsAhead = 1 + Math.floor(random * (total - 1));
  return wrapIndex(current + stepsAhead, total);
}

export type ArtistGroup = {
  artist: string;
  pairs: SamplePair[];
};

// Groups pairs under the artist of the original, in the order each artist first appears.
// `artistName` turns a credit such as "Hailu Mergia & The Walias" into the name to group under.
export function groupByOriginalArtist(
  pairs: SamplePair[],
  artistName: (credit: string) => string,
): ArtistGroup[] {
  const groups: ArtistGroup[] = [];

  for (const pair of pairs) {
    const artist = artistName(pair.original.artist);
    const group = groups.find((entry) => entry.artist === artist);
    if (group) {
      group.pairs.push(pair);
    } else {
      groups.push({ artist, pairs: [pair] });
    }
  }

  return groups;
}

// Moving through the collection: wrapping at the ends, and shuffling.
// Plain functions with no imports that run, so the tests can load this file directly.

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

// Plays every item once in a random order, then reshuffles and goes round again,
// so nothing repeats until everything has been heard.

export type ShuffleQueue<Item> = { next: () => Item };

export function createShuffleQueue<Item>(
  items: readonly Item[],
  random: () => number = Math.random,
): ShuffleQueue<Item> {
  if (items.length === 0) throw new Error("A shuffle queue needs at least one item.");

  let remaining: Item[] = [];
  let lastPlayed: Item | undefined;

  function refill() {
    remaining = [...items];
    // Fisher–Yates shuffle.
    for (let index = remaining.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(random() * (index + 1));
      [remaining[index], remaining[swapIndex]] = [remaining[swapIndex], remaining[index]];
    }
    // Items are taken from the end. Avoid starting a new round with the item that just played.
    const upNext = remaining.length - 1;
    if (remaining.length > 1 && remaining[upNext] === lastPlayed) {
      [remaining[0], remaining[upNext]] = [remaining[upNext], remaining[0]];
    }
  }

  return {
    next() {
      if (remaining.length === 0) refill();
      lastPlayed = remaining.pop() as Item;
      return lastPlayed;
    },
  };
}

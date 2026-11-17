// The matching rules behind the site search (the ⌘K box). Kept free of React so it can be tested alone.

export type Searchable = {
  title: string;
  // Small grey text after the title, e.g. a date or where a skill was used. Also searched.
  detail?: string;
  // Group shown on the right: "Section", "Project", "Photo", "Skill", ...
  type: string;
  // Extra words that should find this item but are not shown.
  keywords?: string;
};

const MAX_RESULTS = 8;

// Best matches first: titles that start with the query, then titles that contain it,
// then items whose detail or keywords mention it. With no query, a short starter list is shown.
export function findItems<Item extends Searchable>(
  items: readonly Item[],
  query: string,
  starterTypes: readonly string[],
): Item[] {
  const text = query.trim().toLowerCase();
  if (!text) return items.filter((item) => starterTypes.includes(item.type));

  const ranked: { item: Item; rank: number }[] = [];
  for (const item of items) {
    const title = item.title.toLowerCase();
    let rank = -1;
    if (title.startsWith(text)) rank = 0;
    else if (title.includes(text)) rank = 1;
    else if (`${item.detail ?? ""} ${item.keywords ?? ""}`.toLowerCase().includes(text)) rank = 2;
    if (rank >= 0) ranked.push({ item, rank });
  }

  // Array.sort is stable, so items with the same rank keep their original order.
  return ranked
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_RESULTS)
    .map((entry) => entry.item);
}

// Splits a title around the part that matched, so that part can be underlined.
export function splitAtMatch(title: string, query: string): { before: string; match: string; after: string } {
  const text = query.trim().toLowerCase();
  const start = text ? title.toLowerCase().indexOf(text) : -1;
  if (start < 0) return { before: title, match: "", after: "" };

  const end = start + text.length;
  return { before: title.slice(0, start), match: title.slice(start, end), after: title.slice(end) };
}

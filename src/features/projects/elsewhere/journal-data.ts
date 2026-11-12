export type JournalPhoto = {
  id: string;
  kind: "photo";
  place: string;
  date: string;
  image: string;
  // Real pixel size, so each photo keeps its own shape instead of being cropped.
  width: number;
  height: number;
  alt: string;
};

// A short proverb placed right after the photo it belongs with.
export type JournalQuote = {
  id: string;
  kind: "quote";
  amharic: string;
  english: string;
};

export type JournalEntry = JournalPhoto | JournalQuote;

// The journal in scroll order, oldest photo first. Images live in
// public/projects/elsewhere and have had all location and camera data removed.
export const journalEntries: JournalEntry[] = [
  {
    id: "seattle-2024",
    kind: "photo",
    place: "Seattle",
    date: "Jun 2024",
    image: "/projects/elsewhere/2024-06-seattle.jpg",
    width: 1170,
    height: 2080,
    alt: "Yakob in front of the plant-covered wall at The Spheres in Seattle.",
  },
  {
    id: "japan-2025",
    kind: "photo",
    place: "Japan",
    date: "May 2025",
    image: "/projects/elsewhere/2025-05-japan.jpg",
    width: 1536,
    height: 2304,
    alt: "Four friends looking out over a Japanese city from a hilltop lined with pink azaleas.",
  },
  {
    id: "fuji-2025",
    kind: "photo",
    place: "Mt. Fuji",
    date: "May 2025",
    image: "/projects/elsewhere/2025-05-mount-fuji.jpg",
    width: 1600,
    height: 2400,
    alt: "Yakob on a rocky lakeshore, pointing toward Mount Fuji across the water.",
  },
  {
    id: "chicago-2025",
    kind: "photo",
    place: "Chicago",
    date: "Nov 2025",
    image: "/projects/elsewhere/2025-11-chicago.jpg",
    width: 2400,
    height: 1600,
    alt: "A group of friends in winter jackets in front of the Bean in Chicago.",
  },
  {
    id: "basye-2025",
    kind: "photo",
    place: "Basye, Virginia",
    date: "Dec 2025",
    image: "/projects/elsewhere/2025-12-basye.jpg",
    width: 2400,
    height: 1600,
    alt: "Friends bundled up in winter coats outside a wooden cabin.",
  },
  {
    id: "quote-friends",
    kind: "quote",
    amharic: "ድር ቢያብር አንበሳ ያስር",
    english: "When spider webs unite, they can tie up a lion.",
  },
  {
    id: "washington-dc-2026",
    kind: "photo",
    place: "Washington, DC",
    date: "Jan 2026",
    image: "/projects/elsewhere/2026-01-washington-dc.jpg",
    width: 1170,
    height: 655,
    alt: "Friends covered head to toe in bright colored paint.",
  },
  {
    id: "ohio-union-2026",
    kind: "photo",
    place: "Ohio Union",
    date: "Jan 2026",
    image: "/projects/elsewhere/2026-01-ohio-union.jpg",
    width: 2400,
    height: 1600,
    alt: "Yakob and two friends in white habesha shirts with tibeb embroidery at Night by the Red Sea.",
  },
  {
    id: "cueva-ventana-2026",
    kind: "photo",
    place: "Cueva Ventana, Puerto Rico",
    date: "Mar 2026",
    image: "/projects/elsewhere/2026-03-puerto-rico-cave.jpg",
    width: 2400,
    height: 1800,
    alt: "Four friends in hard hats standing in the mouth of a cave that opens onto a green valley.",
  },
  {
    id: "puerto-rico-2026",
    kind: "photo",
    place: "Puerto Rico",
    date: "Mar 2026",
    image: "/projects/elsewhere/2026-03-puerto-rico-mountains.jpg",
    width: 1800,
    height: 2400,
    alt: "Yakob and three friends taking a selfie with green mountains behind them.",
  },
  {
    id: "natural-bridge-2026",
    kind: "photo",
    place: "Natural Bridge, Kentucky",
    date: "Aug 2026",
    image: "/projects/elsewhere/2026-08-natural-bridge.jpg",
    width: 1080,
    height: 1620,
    alt: "Yakob standing on a rock ledge above a forested valley at Natural Bridge State Resort Park.",
  },
  {
    id: "quote-journey",
    kind: "quote",
    amharic: "ቀስ በቀስ እንቁላል በእግሩ ይሄዳል",
    english: "Little by little, an egg will walk.",
  },
];

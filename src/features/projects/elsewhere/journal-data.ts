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

// A saying placed right after the photo it belongs with, ideally from that
// place's own culture. "lang" is the language code of the original text.
export type JournalQuote = {
  id: string;
  kind: "quote";
  original: string;
  lang: "am" | "ja" | "es";
  english: string;
  source: string;
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
    id: "quote-fuji",
    kind: "quote",
    original: "富士山に登らぬ馬鹿、二度登る馬鹿",
    lang: "ja",
    english: "Only a fool never climbs Mount Fuji, and only a fool climbs it twice.",
    source: "Japanese saying",
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
    id: "quote-basye",
    kind: "quote",
    original: "ድር ቢያብር አንበሳ ያስር",
    lang: "am",
    english: "When spider webs unite, they can tie up a lion.",
    source: "Amharic proverb",
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
    id: "quote-ohio-union",
    kind: "quote",
    original: "አንድ እጅ አያጨበጭብም",
    lang: "am",
    english: "One hand cannot clap.",
    source: "Amharic proverb",
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
    id: "quote-cueva-ventana",
    kind: "quote",
    original: "Camarón que se duerme se lo lleva la corriente",
    lang: "es",
    english: "The shrimp that falls asleep gets swept away by the current.",
    source: "Puerto Rican saying",
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
    id: "quote-natural-bridge",
    kind: "quote",
    original: "ቀስ በቀስ እንቁላል በእግሩ ይሄዳል",
    lang: "am",
    english: "Little by little, an egg will walk.",
    source: "Amharic proverb",
  },
];

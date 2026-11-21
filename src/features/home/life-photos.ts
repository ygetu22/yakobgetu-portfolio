// The photos in the Life strip on Home. The full photo journal is being reworked
// (saved on the local branch elsewhere-journal-v1), so only these few ship for now.

export type LifePhoto = {
  id: string;
  place: string;
  date: string;
  image: string;
  // Real pixel size, so each photo keeps its own shape instead of being cropped.
  width: number;
  height: number;
  // What the photo shows, for visitors who cannot see it.
  alt: string;
};

const PHOTO_FOLDER = "/images/life";

export const lifePhotos: LifePhoto[] = [
  {
    id: "space-needle-dusk",
    place: "Space Needle, Seattle",
    date: "May 2024",
    image: `${PHOTO_FOLDER}/2024-05-seattle-space-needle-dusk.jpg`,
    width: 1800,
    height: 2400,
    alt: "The Space Needle against a deep blue evening sky, with a street lamp and a red traffic light below.",
  },
  {
    id: "diablo-lake",
    place: "Diablo Lake, Washington",
    date: "Jul 2024",
    image: `${PHOTO_FOLDER}/2024-07-diablo-lake.jpg`,
    width: 1170,
    height: 1785,
    alt: "Turquoise Diablo Lake winding between forested mountains under a clear blue sky.",
  },
  {
    id: "hudson-river-sunset",
    place: "Hudson River, New York",
    date: "Mar 2025",
    image: `${PHOTO_FOLDER}/2025-03-hudson-river-sunset.jpg`,
    width: 1600,
    height: 2400,
    alt: "Me in a red jacket on the deck of a ferry on the Hudson River at sunset, with the skyline behind.",
  },
  {
    id: "san-francisco",
    place: "San Francisco",
    date: "Apr 2025",
    image: `${PHOTO_FOLDER}/2025-04-san-francisco.jpg`,
    width: 1600,
    height: 2400,
    alt: "Me beside a bush of white flowers on a garden path, with stone columns in the background.",
  },
  {
    id: "fushimi-inari",
    place: "Fushimi Inari, Kyoto",
    date: "May 2025",
    image: `${PHOTO_FOLDER}/2025-05-fushimi-inari.jpg`,
    width: 1600,
    height: 2400,
    alt: "The tall vermilion gate of Fushimi Inari shrine on a rainy day, with visitors under umbrellas.",
  },
  {
    id: "mount-fuji",
    place: "Mt. Fuji",
    date: "May 2025",
    image: `${PHOTO_FOLDER}/2025-05-mount-fuji.jpg`,
    width: 1600,
    height: 2400,
    alt: "Snow-capped Mount Fuji above Lake Kawaguchi under a grey sky, with one small boat on the water.",
  },
  {
    id: "metlife-stadium",
    place: "MetLife Stadium, New Jersey",
    date: "Jun 2025",
    image: `${PHOTO_FOLDER}/2025-06-metlife-stadium.jpg`,
    width: 1600,
    height: 2400,
    alt: "A group of friends standing outside MetLife Stadium at night, its lights glowing behind them.",
  },
  {
    id: "washington-monument",
    place: "Washington, DC",
    date: "Jul 2025",
    image: `${PHOTO_FOLDER}/2025-07-washington-monument.jpg`,
    width: 1600,
    height: 2400,
    alt: "The Washington Monument under a sky full of clouds, with a few people on the lawn below.",
  },
  {
    id: "chicago-night",
    place: "Chicago",
    date: "Nov 2025",
    image: `${PHOTO_FOLDER}/2025-11-chicago-night.jpg`,
    width: 1600,
    height: 2400,
    alt: "Downtown Chicago at night: a lit clock tower above a subway entrance and a passing red bus.",
  },
  {
    id: "basye-cabin",
    place: "Basye, Virginia",
    date: "Dec 2025",
    image: `${PHOTO_FOLDER}/2025-12-basye-cabin.jpg`,
    width: 1600,
    height: 2400,
    alt: "Friends in winter jackets and beanies in front of a wooden cabin.",
  },
  {
    id: "ohio-union",
    place: "Ohio Union, Columbus",
    date: "Jan 2026",
    image: `${PHOTO_FOLDER}/2026-01-ohio-union.jpg`,
    width: 1600,
    height: 2400,
    alt: "Friends in white habesha shirts with tibeb trim under a red Night by the Red Sea sign.",
  },
  {
    id: "cueva-ventana-view",
    place: "Cueva Ventana, Puerto Rico",
    date: "Mar 2026",
    image: `${PHOTO_FOLDER}/2026-03-cueva-ventana-view.jpg`,
    width: 1600,
    height: 2400,
    alt: "A green river valley seen through the dark opening of a cave.",
  },
  {
    id: "natural-bridge",
    place: "Natural Bridge, Kentucky",
    date: "Aug 2026",
    image: `${PHOTO_FOLDER}/2026-08-natural-bridge.jpg`,
    width: 1080,
    height: 1620,
    alt: "Me sitting on a rock ledge above a valley of green, tree-covered hills.",
  },
  {
    id: "times-square",
    place: "Times Square, New York",
    date: "Oct 2026",
    image: `${PHOTO_FOLDER}/2026-10-times-square.jpg`,
    width: 1600,
    height: 2400,
    alt: "A crowded sidewalk at night under bright signs and billboards near Times Square.",
  },
];

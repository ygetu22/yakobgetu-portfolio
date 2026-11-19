export type JournalPhoto = {
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

// A quote that closes a chapter, from that place's own writers or sayings where possible.
export type JournalQuote = {
  id: string;
  // Language code of the original text.
  lang: "am" | "ja" | "es" | "en";
  original: string;
  // Null when the original is already in English.
  english: string | null;
  source: string;
};

// One trip or place: its photos in the order they were taken, and sometimes a closing quote.
export type JournalChapter = {
  id: string;
  title: string;
  when: string;
  photos: JournalPhoto[];
  quote?: JournalQuote;
};

const PHOTO_FOLDER = "/projects/elsewhere";

// The journal from the beginning. Photos are prepared by scripts/prepare-journal-photos.mjs,
// which also removes their location and camera data.
export const journalChapters: JournalChapter[] = [
  {
    id: "seattle",
    title: "Seattle",
    when: "Summer 2024",
    photos: [
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
        id: "post-alley",
        place: "Post Alley, Seattle",
        date: "Jun 2024",
        image: `${PHOTO_FOLDER}/2024-06-seattle-post-alley.jpg`,
        width: 1800,
        height: 2400,
        alt: "People walking through the gum-covered alley at Pike Place Market, toward daylight at the far end.",
      },
      {
        id: "space-needle-night",
        place: "Space Needle, Seattle",
        date: "Jul 2024",
        image: `${PHOTO_FOLDER}/2024-07-seattle-space-needle-night.jpg`,
        width: 1800,
        height: 2400,
        alt: "The Space Needle lit up at night, seen from below past dark tree branches.",
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
    ],
    quote: {
      id: "quote-seattle",
      lang: "en",
      original: "And did you get what\nyou wanted from this life, even so?\nI did.\nAnd what did you want?\nTo call myself beloved, to feel myself\nbeloved on the earth.",
      english: null,
      source: "Raymond Carver · Late Fragment, 1989",
    },
  },
  {
    id: "japan",
    title: "Japan",
    when: "May 2025",
    photos: [
      {
        id: "tokyo-train",
        place: "Tokyo",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-tokyo-train.jpg`,
        width: 1600,
        height: 2400,
        alt: "A crowded Tokyo train car, with passengers holding the hanging straps beside their suitcases.",
      },
      {
        id: "tokyo-flea-market",
        place: "Tokyo",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-tokyo-flea-market.jpg`,
        width: 1600,
        height: 2400,
        alt: "Shoppers looking through racks of clothes at an outdoor flea market on a sunny day.",
      },
      {
        id: "shinjuku-street",
        place: "Shinjuku, Tokyo",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-shinjuku-street.jpg`,
        width: 1600,
        height: 2400,
        alt: "A wide Shinjuku street in soft evening light, with people crossing and towers in the distance.",
      },
      {
        id: "shinjuku-cocoon-tower",
        place: "Shinjuku, Tokyo",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-shinjuku-cocoon-tower.jpg`,
        width: 1600,
        height: 2400,
        alt: "The curved, web-patterned Cocoon Tower rising above a busy Shinjuku street.",
      },
      {
        id: "japan-rickshaw",
        place: "Japan",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-japan-rickshaw.jpg`,
        width: 1600,
        height: 2400,
        alt: "A rickshaw puller in a red coat pulling a passenger along a tree-lined stone street.",
      },
      {
        id: "daikoku-parking",
        place: "Daikoku, Yokohama",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-daikoku-parking.jpg`,
        width: 1600,
        height: 2400,
        alt: "Hundreds of parked cars beneath stacked, looping highway ramps.",
      },
      {
        id: "daikoku-supra",
        place: "Daikoku, Yokohama",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-daikoku-supra.jpg`,
        width: 1600,
        height: 2400,
        alt: "A grey Toyota Supra parked in front of the looping highway ramps.",
      },
      {
        id: "kyoto-morning-road",
        place: "Kyoto",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-kyoto-morning-road.jpg`,
        width: 1600,
        height: 2400,
        alt: "An empty road early in the morning, with tall trees on one side and low buildings on the other.",
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
        id: "kyoto-overlook",
        place: "Kyoto",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-kyoto-overlook.jpg`,
        width: 1536,
        height: 2304,
        alt: "Four friends, seen from behind, looking out over the city from a hilltop lined with pink azaleas.",
      },
      {
        id: "kyoto-night-skyline",
        place: "Kyoto",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-kyoto-night-skyline.jpg`,
        width: 1600,
        height: 2400,
        alt: "A yellow Nissan Skyline parked on a lantern-lit street at night.",
      },
      {
        id: "nara-deer",
        place: "Nara",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-nara-deer.jpg`,
        width: 1818,
        height: 1228,
        alt: "Deer resting and grazing in Nara Park while visitors walk among them.",
      },
      {
        id: "osaka-night",
        place: "Osaka",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-osaka-night.jpg`,
        width: 1600,
        height: 2400,
        alt: "A white car passing glowing red signs at night, blurred by its own movement.",
      },
      {
        id: "kawaguchiko-path",
        place: "Lake Kawaguchi",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-kawaguchiko-path.jpg`,
        width: 1600,
        height: 2400,
        alt: "Three people walking down a wet path toward a wooden shop, with Mount Fuji hidden in cloud behind it.",
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
        id: "fuji-lawson",
        place: "Fujikawaguchiko",
        date: "May 2025",
        image: `${PHOTO_FOLDER}/2025-05-fuji-lawson.jpg`,
        width: 1600,
        height: 2400,
        alt: "Mount Fuji behind a Lawson convenience store and a tangle of power lines.",
      },
    ],
    quote: {
      id: "quote-japan",
      lang: "ja",
      original: "日々旅にして、旅を栖とす。",
      english: "Every day is a journey, and the journey itself is home.",
      source: "Matsuo Bashō · Oku no Hosomichi, 1689 · tr. Sam Hamill",
    },
  },
  {
    id: "washington-dc",
    title: "Washington, DC",
    when: "July 2025",
    photos: [
      {
        id: "washington-monument",
        place: "Washington, DC",
        date: "Jul 2025",
        image: `${PHOTO_FOLDER}/2025-07-washington-monument.jpg`,
        width: 1600,
        height: 2400,
        alt: "The Washington Monument under a sky full of clouds, with a few people on the lawn below.",
      },
    ],
  },
  {
    id: "chicago",
    title: "Chicago",
    when: "November 2025",
    photos: [
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
        id: "chicago-skyline",
        place: "Millennium Park, Chicago",
        date: "Nov 2025",
        image: `${PHOTO_FOLDER}/2025-11-chicago-skyline.jpg`,
        width: 1800,
        height: 2400,
        alt: "Chicago skyscrapers under a bright blue sky, with the edge of the Bean reflecting them.",
      },
      {
        id: "chicago-bean",
        place: "The Bean, Chicago",
        date: "Nov 2025",
        image: `${PHOTO_FOLDER}/2025-11-chicago-bean.jpg`,
        width: 2400,
        height: 1600,
        alt: "Five friends in winter jackets standing in front of the Bean.",
      },
      {
        id: "art-institute",
        place: "Art Institute of Chicago",
        date: "Nov 2025",
        image: `${PHOTO_FOLDER}/2025-11-art-institute.jpg`,
        width: 1800,
        height: 2400,
        alt: "A person in a black jacket standing at a gallery doorway, with a painting visible in the next room.",
      },
    ],
    quote: {
      id: "quote-chicago",
      lang: "en",
      original: "Like loving a woman with a broken nose, you may well find lovelier lovelies. But never a lovely so real.",
      english: null,
      source: "Nelson Algren · Chicago: City on the Make, 1951",
    },
  },
  {
    id: "basye",
    title: "Basye, Virginia",
    when: "December 2025",
    photos: [
      {
        id: "basye-cabin",
        place: "Basye, Virginia",
        date: "Dec 2025",
        image: `${PHOTO_FOLDER}/2025-12-basye-cabin.jpg`,
        width: 2400,
        height: 1600,
        alt: "Five friends bundled up in winter coats outside a wooden cabin.",
      },
    ],
  },
  {
    id: "puerto-rico",
    title: "Puerto Rico",
    when: "March 2026",
    photos: [
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
        id: "cueva-ventana-friends",
        place: "Cueva Ventana, Puerto Rico",
        date: "Mar 2026",
        image: `${PHOTO_FOLDER}/2026-03-cueva-ventana-friends.jpg`,
        width: 2400,
        height: 1800,
        alt: "Four friends in hard hats standing in the mouth of a cave that opens onto a green valley.",
      },
      {
        id: "puerto-rico-boats",
        place: "Puerto Rico",
        date: "Mar 2026",
        image: `${PHOTO_FOLDER}/2026-03-puerto-rico-boats.jpg`,
        width: 2296,
        height: 1536,
        alt: "A sailboat and a motorboat on blue water under tall white clouds.",
      },
      {
        id: "puerto-rico-court",
        place: "Puerto Rico",
        date: "Mar 2026",
        image: `${PHOTO_FOLDER}/2026-03-puerto-rico-court.jpg`,
        width: 1536,
        height: 2304,
        alt: "A basketball court painted pink and blue beside the sea, ringed with palm trees, with a few people playing.",
      },
    ],
    quote: {
      id: "quote-puerto-rico",
      lang: "es",
      original: "¡Río Grande de Loíza!… Alárgate en mi espíritu\ny deja que mi alma se pierda en tus riachuelos.",
      english: "Río Grande de Loíza! Stretch out in my spirit, and let my soul lose itself in your streams.",
      source: "Julia de Burgos · Río Grande de Loíza, 1938",
    },
  },
  {
    id: "new-york",
    title: "New York",
    when: "October 2026",
    photos: [
      {
        id: "new-york-taxi",
        place: "New York",
        date: "Oct 2026",
        image: `${PHOTO_FOLDER}/2026-10-new-york-taxi.jpg`,
        width: 1600,
        height: 2400,
        alt: "A yellow taxi on a narrow street between tall glass towers.",
      },
      {
        id: "new-york-noho",
        place: "NoHo, New York",
        date: "Oct 2026",
        image: `${PHOTO_FOLDER}/2026-10-new-york-noho.jpg`,
        width: 1600,
        height: 2400,
        alt: "A NoHo street corner: a man leaning beside a trash can as a silver car passes and a crowd waits to cross.",
      },
      {
        id: "new-york-sidewalk",
        place: "New York",
        date: "Oct 2026",
        image: `${PHOTO_FOLDER}/2026-10-new-york-sidewalk.jpg`,
        width: 2400,
        height: 1600,
        alt: "The word “Sidetalk” stencilled in white on a New York sidewalk.",
      },
      {
        id: "citi-field",
        place: "Citi Field, New York",
        date: "Oct 2026",
        image: `${PHOTO_FOLDER}/2026-10-citi-field.jpg`,
        width: 1600,
        height: 2400,
        alt: "A night soccer match at Citi Field seen from the stands, with a player shown on the big screen.",
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
    ],
    quote: {
      id: "quote-new-york",
      lang: "en",
      original: "No one should come to New York to live unless he is willing to be lucky.",
      english: null,
      source: "E. B. White · Here Is New York, 1949",
    },
  },
];

// The saying the whole journal ends on.
export const closingQuote: JournalQuote = {
  id: "quote-closing",
  lang: "am",
  original: "ቀስ በቀስ እንቁላል በእግሩ ይሄዳል",
  english: "Little by little, the egg will walk on its own legs.",
  source: "Amharic proverb",
};

export const journalPhotos: JournalPhoto[] = journalChapters.flatMap((chapter) => chapter.photos);

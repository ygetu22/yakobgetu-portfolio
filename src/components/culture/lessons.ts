// Short explanations shown when a visitor points at something Ethiopian on the site.
// Most end with a link to a fuller, reliable source; the ones about me just say what they are.

export type Lesson = {
  title: string;
  text: string;
  // Optional sample line, with how it sounds.
  example?: string;
  exampleSound?: string;
  source?: { label: string; url: string };
};

export const lessons = {
  fidel: {
    title: "ፊደል · Fidel",
    text: "These letters are fidel, the Ge'ez script. Ethiopia uses it to write Amharic and other languages, and it has been in use for well over 1,500 years. Each letter is a whole syllable, and one consonant has seven forms.",
    example: "ሀ ሁ ሂ ሃ ሄ ህ ሆ",
    exampleSound: "ha · hu · hi · hā · he · hə · ho",
    source: { label: "Omniglot: the Ge'ez script", url: "https://www.omniglot.com/writing/ethiopic.htm" },
  },
  tibeb: {
    title: "ጥበብ · Tibeb",
    text: "The woven pattern on the edge of Ethiopian clothes such as the netela and the habesha kemis. Weavers make it by hand, one thread at a time. This band is drawn the same way: one small square per thread.",
    source: { label: "Wikipedia: Habesha kemis", url: "https://en.wikipedia.org/wiki/Habesha_kemis" },
  },
  calendar: {
    title: "The Ethiopian calendar",
    text: "Ethiopia keeps its own calendar: twelve months of 30 days and a short thirteenth month. It runs seven to eight years behind the Western one, and the new year begins in September.",
    source: { label: "Wikipedia: Ethiopian calendar", url: "https://en.wikipedia.org/wiki/Ethiopian_calendar" },
  },
  selam: {
    title: "ሰላም · Selam",
    text: "The everyday hello in Amharic. The same word also means peace.",
  },
  tizita: {
    title: "ትዝታ · Tizita",
    text: "Amharic for memory and longing. It is also the name of a classic kind of Ethiopian song about remembering.",
    source: { label: "Wikipedia: Tizita", url: "https://en.wikipedia.org/wiki/Tizita" },
  },
  name: {
    title: "ያዕቆብ ጌቱ · Yakob Getu",
    text: "My name in Ge'ez, the script Amharic is written in.",
  },
} satisfies Record<string, Lesson>;

export type LessonName = keyof typeof lessons;

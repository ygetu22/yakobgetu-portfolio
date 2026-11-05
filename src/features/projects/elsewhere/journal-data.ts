export type JournalPhoto = {
  id: string;
  kind: "photo";
  label: string;
  image: string | null;
  alt: string;
};

export type JournalNote = {
  id: string;
  kind: "quote" | "message";
  text: string;
};

export type JournalScene = {
  id: string;
  items: (JournalPhoto | JournalNote)[];
};

// Three full-screen compositions, in scroll order. The item order matches the
// numbered layout slots in elsewhere.css. Replace null with a /images/portraits/... path.
// Labels sit together above each photo, e.g. "ADDIS ABABA, 2026". The canvas
// behind them uses restrained tibeb-inspired threadwork, so keep labels brief.
export const journalScenes: JournalScene[] = [
  {
    id: "opening",
    items: [
      { id: "photo-01", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-02", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-03", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-04", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-05", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "quote-01", kind: "quote", text: "A thought from somewhere along the way." },
    ],
  },
  {
    id: "along-the-way",
    items: [
      { id: "photo-06", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-07", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-08", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-09", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-10", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "quote-02", kind: "quote", text: "A memory worth keeping. A little perspective." },
    ],
  },
  {
    id: "a-little-further",
    items: [
      { id: "photo-11", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-12", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-13", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "photo-14", kind: "photo", label: "LOCATION, YEAR", image: null, alt: "" },
      { id: "message-01", kind: "message", text: "A small story to leave between the photographs." },
      { id: "quote-03", kind: "quote", text: "More places. More stories. Room for what comes next." },
    ],
  },
];

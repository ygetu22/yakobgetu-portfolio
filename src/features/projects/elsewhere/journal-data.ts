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

// Full-screen compositions in scroll order, oldest photo first. The item order
// matches the numbered layout slots in elsewhere.css. Images live in
// public/images/elsewhere and have had all location and camera data removed.
// Labels sit above each photo, e.g. "SEATTLE · JUN 2024", so keep them brief.
export const journalScenes: JournalScene[] = [
  {
    id: "opening",
    items: [
      { id: "seattle-2024", kind: "photo", label: "SEATTLE · JUN 2024", image: "/images/elsewhere/2024-06-seattle.jpg", alt: "Yakob in front of the plant-covered wall at The Spheres in Seattle." },
      { id: "japan-2025", kind: "photo", label: "JAPAN · MAY 2025", image: "/images/elsewhere/2025-05-japan.jpg", alt: "Four friends looking out over a Japanese city from a hilltop lined with pink azaleas." },
      { id: "fuji-2025", kind: "photo", label: "MT. FUJI · MAY 2025", image: "/images/elsewhere/2025-05-mount-fuji.jpg", alt: "Yakob on a rocky lakeshore, pointing toward Mount Fuji across the water." },
      { id: "chicago-2025", kind: "photo", label: "CHICAGO · NOV 2025", image: "/images/elsewhere/2025-11-chicago.jpg", alt: "A group of friends in winter jackets in front of the Bean in Chicago." },
      { id: "basye-2025", kind: "photo", label: "BASYE, VIRGINIA · DEC 2025", image: "/images/elsewhere/2025-12-basye.jpg", alt: "Friends bundled up in winter coats outside a wooden cabin at night." },
      { id: "quote-01", kind: "quote", text: "A thought from somewhere along the way." },
    ],
  },
  {
    id: "along-the-way",
    items: [
      { id: "washington-dc-2026", kind: "photo", label: "WASHINGTON, DC · JAN 2026", image: "/images/elsewhere/2026-01-washington-dc.jpg", alt: "Friends covered head to toe in bright colored powder." },
      { id: "ohio-union-2026", kind: "photo", label: "OHIO UNION · JAN 2026", image: "/images/elsewhere/2026-01-ohio-union.jpg", alt: "Yakob and two friends in white habesha shirts with tibeb embroidery at Night by the Red Sea." },
      { id: "cueva-ventana-2026", kind: "photo", label: "CUEVA VENTANA, PUERTO RICO · MAR 2026", image: "/images/elsewhere/2026-03-puerto-rico-cave.jpg", alt: "Four friends in hard hats standing in the mouth of a cave that opens onto a green valley." },
      { id: "puerto-rico-2026", kind: "photo", label: "PUERTO RICO · MAR 2026", image: "/images/elsewhere/2026-03-puerto-rico-mountains.jpg", alt: "Yakob and three friends taking a selfie with green mountains behind them." },
      // Place not confirmed yet; add it before the year once Yakob confirms.
      { id: "overlook-2026", kind: "photo", label: "AUG 2026", image: "/images/elsewhere/2026-08-overlook.jpg", alt: "Yakob standing on a rock ledge above a forested valley." },
      { id: "quote-02", kind: "quote", text: "A memory worth keeping. A little perspective." },
    ],
  },
];

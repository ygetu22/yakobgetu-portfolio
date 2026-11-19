// Short notes on the artists in the "ethio" playlist, shown in the music card behind the song.
// Each note sticks to what its linked source says. Artists without a note show only their photo.
// Photos come from scripts/fetch-artist-photos.mjs.

export type ArtistNote = {
  text: string;
  source: { label: string; url: string };
};

const WIKIPEDIA = "https://en.wikipedia.org/wiki/";

function wikipedia(title: string) {
  return { label: "Wikipedia", url: `${WIKIPEDIA}${title}` };
}

// Keyed by artistSlug(). Older artists share their wording with the Zempled notes.
const artistNotes: Record<string, ArtistNote> = {
  "aster-aweke": {
    text: "Called the Queen of Ethiopian pop. She moved to the United States in 1981, and her 1989 album Aster carried her voice far beyond Ethiopia.",
    source: wikipedia("Aster_Aweke"),
  },
  "teddy-afro": {
    text: "Tewodros Kassahun, one of the most loved Ethiopian artists of all time. His first album, Abugida (2001), made his name, and his songs often turn to Ethiopia's history and its people.",
    source: wikipedia("Teddy_Afro"),
  },
  "tewodros-kasshun": {
    text: "Teddy Afro's own name, Tewodros Kassahun, credited on some of his early recordings.",
    source: wikipedia("Teddy_Afro"),
  },
  gigi: {
    text: "Ejigayehu Shibabaw. She joins Ethiopian singing with jazz, funk and other styles, often with the bassist and producer Bill Laswell.",
    source: wikipedia("Gigi_(singer)"),
  },
  "gossaye-tesfaye": {
    text: "An Ethiopian singer and songwriter, and the voice behind many of the slow songs on this playlist.",
    source: wikipedia("Gossaye_Tesfaye"),
  },
  "neway-debebe": {
    text: "He first became known through recordings with the Roha Band and went on to release more than five albums of his own.",
    source: wikipedia("Neway_Debebe"),
  },
  "tamrat-desta": {
    text: "A singer and songwriter best known for his albums Anleyaym (2004) and Kanchi Ayebeltm (2008).",
    source: wikipedia("Tamrat_Desta"),
  },
  "mikaya-behailu": {
    text: "Her 2007 album Shemametew made her one of the best-known voices of her generation, and earned a Kora Award nomination in 2009.",
    source: wikipedia("Mikaya_Behailu"),
  },
  "mulatu-astatke": {
    text: "The father of Ethio-jazz. He studied in London, New York and Boston, then joined jazz and Latin rhythms to Ethiopia's five-note scales.",
    source: wikipedia("Mulatu_Astatke"),
  },
  "mahmoud-ahmed": {
    text: "He shined shoes as a boy, got his break with the Imperial Bodyguard Band, and became one of the defining voices of Ethiopia's golden age.",
    source: wikipedia("Mahmoud_Ahmed"),
  },
  "alemayehu-eshete": {
    text: "A star of the 1960s and 70s, nicknamed the Ethiopian Elvis for his stage moves and soul shouts.",
    source: wikipedia("Alemayehu_Eshete"),
  },
  "getatchew-mekurya": {
    text: "A saxophonist who turned shellela, a warrior's chant, into a fierce style of playing all his own.",
    source: wikipedia("Getatchew_Mekurya"),
  },
  "hailu-mergia": {
    text: "Keyboardist of the Walias Band. He stayed in Washington, DC after a 1981 tour and drove a taxi for years, until reissues of his old tapes brought him back to the stage.",
    source: wikipedia("Hailu_Mergia"),
  },
};

// What a few song titles mean, for songs whose title says what the song is about.
const songMeanings: Record<string, string> = {
  Tizita: "Tizita means memory, or longing for what is gone. It is also the name of a whole style of Ethiopian song.",
  Hagerae: "Hagerae means “my country.”",
  "Wede Ager Bet": "Wede ager bet means “toward home.”",
  Fikir: "Fikir means love.",
  Nafkot: "Nafkot means longing for someone far away.",
};

// "Teddy Afro" -> "teddy-afro". A shared credit ("Hailu Mergia, Dahlak Band") uses its first
// named artist. Must match the rule in scripts/fetch-artist-photos.mjs, which names the photos.
export function artistSlug(credit: string): string {
  const firstArtist =
    credit
      .split(",")
      .map((name) => name.trim())
      .find((name) => name !== "Various Artists") ?? credit;
  return firstArtist
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Artists whose photo could not be found on Spotify.
const ARTISTS_WITHOUT_PHOTO = new Set(["bezawork-asfaw", "jacky-gosse", "mezimur-yohannese", "abenet-agonafer"]);

export function artistPhoto(credit: string): string | null {
  const slug = artistSlug(credit);
  return ARTISTS_WITHOUT_PHOTO.has(slug) ? null : `/music/artists/${slug}.jpg`;
}

export function artistNote(credit: string): ArtistNote | null {
  return artistNotes[artistSlug(credit)] ?? null;
}

export function songMeaning(title: string): string | null {
  return songMeanings[title] ?? null;
}

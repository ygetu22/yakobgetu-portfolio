// The music card shows what the current song is about, the artist's photo behind it, and a link
// to the artist's Wikipedia page. Photos come from scripts/fetch-artist-photos.mjs.

// Wikipedia page titles, keyed by artistSlug().
const artistWikipediaPages: Record<string, string> = {
  "aster-aweke": "Aster_Aweke",
  "teddy-afro": "Teddy_Afro",
  "tewodros-kasshun": "Teddy_Afro",
  "gigi": "Gigi_(singer)",
  "gossaye-tesfaye": "Gossaye_Tesfaye",
  "neway-debebe": "Neway_Debebe",
  "tamrat-desta": "Tamrat_Desta",
  "mikaya-behailu": "Mikaya_Behailu",
  "mulatu-astatke": "Mulatu_Astatke",
  "mahmoud-ahmed": "Mahmoud_Ahmed",
  "alemayehu-eshete": "Alemayehu_Eshete",
  "getatchew-mekurya": "Getatchew_Mekurya",
  "hailu-mergia": "Hailu_Mergia",
};

// What a song is about, keyed by its title as it appears in the playlist. Most say what the
// title means; a song without an entry shows only its title and artist.
const songMeanings: Record<string, string> = {
  Tizita: "Tizita means memory, or longing for what is gone. It is also the name of a whole style of Ethiopian song.",
  Tezeta: "Tezeta means memory, or longing for what is gone. It is also the name of a whole style of Ethiopian song.",
  "Yègellé Tezeta": "“My own Tezeta”: an instrumental take on tezeta, the Ethiopian song of memory and longing.",
  "Yèkèrmo Sèw": "Yèkèrmo sèw means “a man of experience,” someone who has lived through a lot.",
  "Muziqa heywete": "Muziqa heywete means “music is my life.”",
  Hagerae: "Hagerae means “my country.”",
  "Wede Ager Bet": "Wede ager bet means “toward home.”",
  "Addis Ababa Bete": "“Addis Ababa, my home”: a song for the capital.",
  "Ke Ehud Eske Ehud": "Ke ehud eske ehud means “from Sunday to Sunday,” all week long.",
  Fikir: "Fikir means love.",
  Fikrey: "Fikrey means “my love.”",
  Nafkot: "Nafkot means longing for someone far away.",
  Ayzoh: "Ayzoh means “take heart,” what you say to someone to keep them going.",
  "Yene Konjo": "Yene konjo means “my beautiful one.”",
  "Lebe [Remastered]": "Lebe means “my heart.”",
  "Semay [Remastered]": "Semay means sky.",
  Merkeb: "Merkeb means ship.",
  Zim: "Zim means silence.",
  Guramayle: "Guramayle means a mix, like a sentence that blends two languages.",
  "Bale Washintu": "Bale washintu means “the one with the flute.”",
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

export function artistWikipediaUrl(credit: string): string | null {
  const page = artistWikipediaPages[artistSlug(credit)];
  return page ? `https://en.wikipedia.org/wiki/${page}` : null;
}

export function songMeaning(title: string): string | null {
  return songMeanings[title] ?? null;
}

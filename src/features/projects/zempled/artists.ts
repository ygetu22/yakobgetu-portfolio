// Short backgrounds on the Ethiopian musicians whose recordings were sampled.
// Kept to facts that the linked page supports.

export type ArtistProfile = {
  name: string;
  // Years or a short tag shown beside the name.
  detail: string;
  bio: string;
  source: { label: string; url: string };
};

const WIKIPEDIA = "https://en.wikipedia.org/wiki/";

export const artistProfiles: ArtistProfile[] = [
  {
    name: "Mulatu Astatke",
    detail: "born 1943, Jimma",
    bio: "The father of Ethio-jazz. He studied music in London, New York and Boston, where he was the first African student at Berklee, then came home and joined jazz and Latin rhythms to Ethiopia’s five-note scales. He plays vibraphone and congas.",
    source: { label: "Wikipedia: Mulatu Astatke", url: `${WIKIPEDIA}Mulatu_Astatke` },
  },
  {
    name: "Alemayehu Eshete",
    detail: "1941–2021",
    bio: "A singer who started in Addis Ababa’s Police Orchestra and became one of the biggest stars of the 1960s and 70s. His stage moves and soul shouts earned him the nicknames “the Ethiopian Elvis” and “the Ethiopian James Brown.”",
    source: { label: "Wikipedia: Alemayehu Eshete", url: `${WIKIPEDIA}Alemayehu_Eshete` },
  },
  {
    name: "Tilahun Gessesse",
    detail: "1940–2009",
    bio: "Known simply as “The Voice.” He rose through the Imperial Bodyguard Band and stayed Ethiopia’s best-loved tenor for half a century. He was given a state funeral.",
    source: { label: "Wikipedia: Tilahun Gessesse", url: `${WIKIPEDIA}Tilahun_Gessesse` },
  },
  {
    name: "Getatchew Mekurya",
    detail: "1935–2016",
    bio: "A tenor saxophonist who turned shellela, a warrior’s chant, into a fierce style of playing all his own. Late in life he toured the world with the Dutch band The Ex.",
    source: { label: "Wikipedia: Getatchew Mekurya", url: `${WIKIPEDIA}Getatchew_Mekurya` },
  },
  {
    name: "Mahmoud Ahmed",
    detail: "born 1941, Addis Ababa",
    bio: "He shined shoes as a boy, got his break singing with the Imperial Bodyguard Band, and became one of the defining voices of Ethiopia’s golden age. His album Erè Mèla Mèla was among the first Ethiopian records heard widely abroad.",
    source: { label: "Wikipedia: Mahmoud Ahmed", url: `${WIKIPEDIA}Mahmoud_Ahmed` },
  },
  {
    name: "Aster Aweke",
    detail: "born 1959, Gondar",
    bio: "One of Ethiopia’s most popular singers. She moved to the United States in 1981, and her 1989 album Aster introduced her voice to listeners around the world.",
    source: { label: "Wikipedia: Aster Aweke", url: `${WIKIPEDIA}Aster_Aweke` },
  },
  {
    name: "Hailu Mergia",
    detail: "born 1946",
    bio: "Keyboardist and accordionist of the Walias Band, the house band of 1970s Addis Ababa nightlife. He stayed in Washington, DC after a 1981 tour and drove a taxi there for years, until reissues of his old tapes brought him back to the stage.",
    source: { label: "Wikipedia: Hailu Mergia", url: `${WIKIPEDIA}Hailu_Mergia` },
  },
  {
    name: "Muluken Melesse",
    detail: "singer",
    bio: "He began singing in Addis Ababa clubs as a boy and recorded some of the most loved songs of the 1970s. He later left secular music for the church.",
    source: { label: "Wikipedia: Muluken Melesse", url: `${WIKIPEDIA}Muluken_Melesse` },
  },
  {
    name: "Tesfa-Maryam Kidane",
    detail: "saxophonist",
    bio: "A saxophonist of Addis Ababa’s early-1970s scene. His slow instrumental “Heywèté” is collected on the Éthiopiques album of Ethiopian blues and ballads.",
    source: { label: "Wikipedia: Éthiopiques", url: `${WIKIPEDIA}%C3%89thiopiques` },
  },
  {
    name: "Seyfu Yohannes",
    detail: "singer",
    bio: "A singer of the golden age whose aching “Tezeta” is one of the best-loved versions of that song. It appears on the first Éthiopiques album.",
    source: { label: "Wikipedia: Éthiopiques", url: `${WIKIPEDIA}%C3%89thiopiques` },
  },
];

// Finds the profile for a credit such as "Hailu Mergia & The Walias" or "Mulatu Astatke & The Heliocentrics".
export function profileFor(artistCredit: string): ArtistProfile | undefined {
  return artistProfiles.find((profile) => artistCredit.startsWith(profile.name));
}

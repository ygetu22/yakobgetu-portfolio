// Ge'ez letters (fidel) with how each one sounds. They drift in the page background,
// and text "decodes" out of them into English when it first appears.
export const fidelLetters: readonly (readonly [letter: string, sound: string])[] = [
  ["ሀ", "ha"], ["ለ", "le"], ["ሐ", "ha"], ["መ", "me"], ["ሠ", "se"], ["ረ", "re"], ["ሰ", "se"], ["ሸ", "she"],
  ["ቀ", "qe"], ["በ", "be"], ["ተ", "te"], ["ቸ", "che"], ["ኀ", "ha"], ["ነ", "ne"], ["ኘ", "nye"], ["አ", "a"],
  ["ከ", "ke"], ["ኸ", "he"], ["ወ", "we"], ["ዐ", "a"], ["ዘ", "ze"], ["ዠ", "zhe"], ["የ", "ye"], ["ደ", "de"],
  ["ጀ", "je"], ["ገ", "ge"], ["ጠ", "t'e"], ["ጨ", "ch'e"], ["ጰ", "p'e"], ["ጸ", "ts'e"], ["ፀ", "ts'e"], ["ፈ", "fe"], ["ፐ", "pe"],
];

export function randomFidelLetter(): string {
  return fidelLetters[Math.floor(Math.random() * fidelLetters.length)][0];
}

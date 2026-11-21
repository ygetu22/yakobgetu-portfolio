// Writes a name typed in English letters in Ge'ez (fidel), by sound.
//
// Every Ge'ez letter is a consonant plus a vowel. Unicode stores each consonant's seven forms in a
// row, in this order: ä, u, i, a, e, ə (no vowel), o. So a letter is `base + vowel order`.
// English spelling is loose, so this is an approximation: "Sarah" → ሳራ, "Daniel" → ዳኒኤል.

export type GeezLetter = {
  glyph: string;
  // How it sounds, in English letters ("sa", "n").
  sound: string;
};

// The first form (ä) of each consonant, by the sound it is used for here.
const consonantBases: Record<string, number> = {
  h: 0x1200, l: 0x1208, m: 0x1218, r: 0x1228, s: 0x1230, sh: 0x1238, q: 0x1240,
  b: 0x1260, v: 0x1268, t: 0x1270, ch: 0x1278, n: 0x1290, ny: 0x1298, k: 0x12a8,
  kh: 0x12b8, w: 0x12c8, z: 0x12d8, zh: 0x12e0, y: 0x12e8, d: 0x12f0, j: 0x1300,
  g: 0x1308, ts: 0x1338, f: 0x1348, p: 0x1350,
};

// A vowel on its own is written on አ, the "glottal" consonant.
const VOWEL_CARRIER = 0x12a0;

// Vowel order in a consonant's row, and how each is said.
const vowelOrders: Record<string, { order: number; sound: string }> = {
  a: { order: 3, sound: "a" },
  e: { order: 4, sound: "e" },
  i: { order: 2, sound: "i" },
  y: { order: 2, sound: "i" },
  o: { order: 6, sound: "o" },
  u: { order: 1, sound: "u" },
};
const NO_VOWEL = 5;

// Two-letter spellings of one sound, checked before single letters.
const digraphs: Record<string, string> = {
  sh: "sh", ch: "ch", ph: "f", th: "t", kh: "kh", ts: "ts", zh: "zh", ck: "k", qu: "k", gh: "g",
};
// Single English letters that stand for another sound.
const letterSounds: Record<string, string> = { c: "k", x: "ks" };

const isVowel = (letter: string | undefined) => letter !== undefined && "aeiou".includes(letter);
const ETHIOPIC = /[ሀ-፿]/;

function letterFor(base: number, order: number): string {
  return String.fromCodePoint(base + order);
}

// Splits one word into consonant sounds followed by an optional vowel.
function transliterateWord(word: string): GeezLetter[] {
  const letters: GeezLetter[] = [];
  // Doubled letters are said once ("Anna" → a-na).
  const text = word.toLowerCase().replace(/[^a-z]/g, "").replace(/(.)\1+/g, "$1");
  let index = 0;

  while (index < text.length) {
    const pair = text.slice(index, index + 2);
    let consonant: string | null = null;

    if (digraphs[pair]) {
      consonant = digraphs[pair];
      index += 2;
    } else if (!isVowel(text[index])) {
      const letter = text[index];
      // "y" between consonants or at the end acts as a vowel ("Andy"), so it is handled below.
      const yIsVowel = letter === "y" && index > 0 && !isVowel(text[index + 1]);
      if (!yIsVowel) {
        // A soft c before e, i or y sounds like s ("Grace", "Cindy").
        consonant = letter === "c" && "eiy".includes(text[index + 1] ?? "") ? "s" : (letterSounds[letter] ?? letter);
        index += 1;
      }
    }

    let vowel = text[index];
    const isLast = index === text.length - 1;
    // A final silent e after a consonant ("Kate", "Mike") adds no sound.
    if (consonant && vowel === "e" && isLast && text.length > 3) {
      vowel = "";
      index += 1;
    }
    // A final "ey" or "ie" is said "i" ("Wesley", "Katie").
    const ending = text.slice(index);
    if (consonant && (ending === "ey" || ending === "ie")) {
      vowel = "i";
      index = text.length - 1;
    }
    // An h after a vowel at the end is silent ("Sarah").
    if (consonant === "h" && index === text.length && letters.length > 0) break;

    const vowelInfo = vowel && (isVowel(vowel) || vowel === "y") ? vowelOrders[vowel] : undefined;
    if (vowelInfo) index += 1;

    if (consonant === null && !vowelInfo) {
      index += 1;
      continue;
    }

    if (consonant === null) {
      const vowelSound = vowelInfo!.sound;
      const previousVowel = letters.at(-1)?.sound.slice(-1);

      // A vowel right after another one glides, the way Amharic spells it:
      // "Kamau" → ካማው, "Joshua" → ጆሹዋ, "Maria" → ማሪያ. An e after i stays ኤ ("Daniel" → ዳኒኤል).
      if (vowelSound === "u" && (previousVowel === "a" || previousVowel === "o")) {
        letters.push({ glyph: letterFor(consonantBases.w, NO_VOWEL), sound: "w" });
      } else if (previousVowel === "u" || (previousVowel === "i" && vowelSound !== "e")) {
        const glide = previousVowel === "u" ? "w" : "y";
        letters.push({ glyph: letterFor(consonantBases[glide], vowelInfo!.order), sound: glide + vowelSound });
      } else {
        // Names written in Amharic start an "a" sound with the plain አ ("Abel" → አቤል).
        const order = vowelSound === "a" ? 0 : vowelInfo!.order;
        letters.push({ glyph: letterFor(VOWEL_CARRIER, order), sound: vowelSound });
      }
      continue;
    }

    // "x" is two sounds; the first gets no vowel of its own.
    const consonantSounds = consonant === "ks" ? ["k", "s"] : [consonant];

    consonantSounds.forEach((sound, position) => {
      const isFinalSound = position === consonantSounds.length - 1;
      const order = isFinalSound && vowelInfo ? vowelInfo.order : NO_VOWEL;
      letters.push({
        glyph: letterFor(consonantBases[sound], order),
        sound: isFinalSound && vowelInfo ? sound + vowelInfo.sound : sound,
      });
    });
  }

  return letters;
}

// Each word of the name, as Ge'ez letters. Names already written in Ge'ez are kept as they are.
export function transliterateName(name: string): GeezLetter[][] {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((word) =>
      ETHIOPIC.test(word)
        ? [...word].filter((letter) => ETHIOPIC.test(letter)).map((glyph) => ({ glyph, sound: "" }))
        : transliterateWord(word),
    )
    .filter((word) => word.length > 0);
}

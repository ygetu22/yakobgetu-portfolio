"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const glyphs = ["ሀ", "ለ", "መ", "ሰ", "ረ", "ቀ", "ገ", "ዐ", "ፀ", "አ", "ዘ", "የ", "ጠ", "ጰ"];

type Character = {
  id: number;
  glyph: string;
  left: string;
  top: string;
  visible: boolean;
};

const initialCharacters: Character[] = [
  { id: 0, glyph: "ሀ", left: "7%", top: "8%", visible: true },
  { id: 1, glyph: "ለ", left: "84%", top: "12%", visible: true },
  { id: 2, glyph: "መ", left: "44%", top: "20%", visible: true },
  { id: 3, glyph: "ሰ", left: "20%", top: "39%", visible: true },
  { id: 4, glyph: "ቀ", left: "75%", top: "45%", visible: true },
  { id: 5, glyph: "ገ", left: "52%", top: "61%", visible: true },
  { id: 6, glyph: "ዐ", left: "11%", top: "76%", visible: true },
  { id: 7, glyph: "ፀ", left: "83%", top: "86%", visible: true },
];

function nextPosition(index: number, characters: Character[]) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const left = 4 + Math.random() * 91;
    const top = 4 + Math.random() * 89;
    const overlaps = characters.some((character, otherIndex) => {
      if (otherIndex === index) return false;

      return Math.abs(parseFloat(character.left) - left) < 9 && Math.abs(parseFloat(character.top) - top) < 11;
    });

    if (!overlaps) {
      return { left: `${left.toFixed(1)}%`, top: `${top.toFixed(1)}%` };
    }
  }

  return { left: characters[index].left, top: characters[index].top };
}

export default function CulturalBackdrop() {
  const { resolvedTheme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [characters, setCharacters] = useState(initialCharacters);

  useEffect(() => {
    if (!enabled) return;

    const interval = window.setInterval(() => {
      const target = Math.floor(Math.random() * initialCharacters.length);

      setCharacters((current) => current.map((character, index) => (
        index === target ? { ...character, visible: false } : character
      )));

      window.setTimeout(() => {
        setCharacters((current) => current.map((character, index) => {
          if (index !== target) return character;

          return {
            ...character,
            glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
            ...nextPosition(index, current),
            visible: true,
          };
        }));
      }, 900);
    }, 2700);

    return () => window.clearInterval(interval);
  }, [enabled]);

  return (
    <>
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500 ${enabled ? "opacity-100" : "opacity-0"}`}>
        {characters.map((character) => (
          <span
            key={character.id}
            className={`absolute font-serif text-4xl text-foreground/[0.14] transition-[left,top,opacity] duration-[650ms] ease-in-out sm:text-5xl ${character.visible ? "opacity-100" : "opacity-0"}`}
            style={{ left: character.left, top: character.top }}
          >
            {character.glyph}
          </span>
        ))}
      </div>

      <div className="fixed left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 sm:left-7">
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-background/75 text-foreground/70 backdrop-blur transition hover:border-foreground/35 hover:text-foreground"
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 15.2A8.2 8.2 0 018.8 4 8.2 8.2 0 1020 15.2z" /><path d="M12 2.5v2M21.5 12h-2M18.7 5.3l-1.4 1.4" /></svg>
        </button>

        <button
          type="button"
          onClick={() => setEnabled((current) => !current)}
          className={`grid h-10 w-10 place-items-center rounded-full border bg-background/75 font-serif text-lg backdrop-blur transition hover:border-foreground/35 ${enabled ? "border-foreground/15 text-foreground/70 hover:text-foreground" : "border-foreground/10 text-foreground/30"}`}
          aria-label={`${enabled ? "Hide" : "Show"} Ge'ez-script background`}
          aria-pressed={enabled}
          title={`${enabled ? "Hide" : "Show"} Ge'ez-script background`}
        >
          ሀ
        </button>
      </div>
    </>
  );
}

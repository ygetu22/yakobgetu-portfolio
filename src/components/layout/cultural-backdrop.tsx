"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useInterfaceSound } from "@/components/providers/interface-sounds";

const glyphs = [
  "ሀ", "ለ", "ሐ", "መ", "ሠ", "ረ", "ሰ", "ሸ", "ቀ", "በ", "ተ",
  "ቸ", "ኀ", "ነ", "ኘ", "አ", "ከ", "ኸ", "ወ", "ዐ", "ዘ", "ዠ",
  "የ", "ደ", "ጀ", "ገ", "ጠ", "ጨ", "ጰ", "ጸ", "ፀ", "ፈ", "ፐ",
];

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
  const playSound = useInterfaceSound();
  const isJournal = usePathname() === "/projects/elsewhere";
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

  const visibleCharacters = isJournal ? characters.filter((character) => character.id % 2 === 0) : characters;
  const controlPosition = isJournal
    ? "left-1/2 top-4 -translate-x-1/2 flex-row"
    : "left-1/2 top-6 -translate-x-1/2 flex-row sm:top-9";
  const controlColors = isJournal
    ? "border-[#211b14]/25 bg-[#e9d6ae]/85 text-[#211b14]/70 dark:border-[#e8d4aa]/25 dark:bg-[#211b14]/85 dark:text-[#e8d4aa]/75"
    : "border-foreground/15 bg-background/75 text-foreground/70";

  return (
    <>
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-500 ${isJournal ? "z-[31]" : "z-0"} ${enabled ? "opacity-100" : "opacity-0"}`}>
        {visibleCharacters.map((character) => (
          <span
            key={character.id}
            className={`absolute font-serif transition-[left,top,opacity] duration-[650ms] ease-in-out ${isJournal ? "text-base text-[#8f281d]/[0.09] dark:text-[#d0a04b]/[0.10] sm:text-lg" : "text-xl text-foreground/[0.22] dark:text-foreground/[0.20] sm:text-2xl"} ${character.visible ? "opacity-100" : "opacity-0"}`}
            style={{ left: character.left, top: character.top }}
          >
            {character.glyph}
          </span>
        ))}
      </div>

      <div className={`fixed z-50 flex gap-2 ${controlPosition}`}>
        <button
          type="button"
          onClick={() => {
            const theme = resolvedTheme === "dark" ? "light" : "dark";
            playSound(theme === "dark" ? "theme-dark" : "theme-light");
            setTheme(theme);
          }}
          className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition hover:scale-105 ${controlColors}`}
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 15.2A8.2 8.2 0 018.8 4 8.2 8.2 0 1020 15.2z" /></svg>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden h-4 w-4 dark:block" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4L19 5" /></svg>
        </button>

        <button
          type="button"
          onClick={() => {
            playSound(enabled ? "background-off" : "background-on");
            setEnabled((current) => !current);
          }}
          className={`grid h-10 w-10 place-items-center rounded-full border font-serif text-lg backdrop-blur transition hover:scale-105 ${controlColors} ${enabled ? "opacity-100" : "opacity-45"}`}
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

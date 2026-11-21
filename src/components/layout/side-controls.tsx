"use client";

import { useTheme } from "next-themes";
import { useCallback, useId, useState } from "react";
import { toggleGlyphs, useGlyphsVisible } from "@/components/culture/glyph-visibility";
import { LessonContent } from "@/components/culture/learn";
import { lessons } from "@/components/culture/lessons";
import { useMagnetic } from "@/components/motion/magnetic";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import { useInterfaceSound } from "@/components/providers/interface-sounds";
import { useHoverCard } from "@/components/ui/hover-card";
import cardStyles from "@/components/ui/hover-card.module.css";
import PhoneSheet from "@/components/ui/phone-sheet";
import { useIsPhone } from "@/components/ui/use-is-phone";
import { useIsInBrowser } from "@/components/ui/use-is-in-browser";
import MiniPlayer from "@/features/music/mini-player";
import MusicCard from "@/features/music/music-card";
import { useMusicPlayer } from "@/features/music/music-player";
import styles from "./side-controls.module.css";

function ThemeButton() {
  const buttonRef = useMagnetic<HTMLButtonElement>();
  const { resolvedTheme, setTheme } = useTheme();
  const playSound = useInterfaceSound();
  // The server cannot know the saved theme, so the first render assumes light.
  const isDark = useIsInBrowser() && resolvedTheme === "dark";

  function switchTheme() {
    const nextTheme = isDark ? "light" : "dark";
    playSound(nextTheme === "dark" ? "theme-dark" : "theme-light");

    const button = buttonRef.current;
    if (!button || !document.startViewTransition || prefersReducedMotion()) {
      setTheme(nextTheme);
      return;
    }

    // The new theme opens as a growing circle from this button.
    const box = button.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      // Set the class right away so the "after" picture is taken in the new theme;
      // next-themes then stores the choice and keeps the class in place.
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        // The transition was skipped (for example the tab was hidden). The theme has still changed.
      });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className="round-button"
      onClick={switchTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4L19 5" />
          </>
        ) : (
          <path d="M20 15.2A8.2 8.2 0 018.8 4 8.2 8.2 0 1020 15.2z" />
        )}
      </svg>
    </button>
  );
}

// Clicking only switches the background letters on and off.
// Pointing at the button (or focusing it) shows what the letters are.
// On phones a tap opens a sheet with the same lesson and a switch for the letters.
function FidelButton() {
  const buttonRef = useMagnetic<HTMLButtonElement>();
  const { isOpen, open, setAnchor, setCard, hoverProps } = useHoverCard("beside");
  const cardId = useId();
  const areVisible = useGlyphsVisible();
  const playSound = useInterfaceSound();
  const isPhone = useIsPhone();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  function switchLetters() {
    playSound(toggleGlyphs() ? "background-on" : "background-off");
  }

  return (
    <>
      <span ref={setAnchor} className={styles.anchor} {...hoverProps}>
        <button
          ref={buttonRef}
          type="button"
          className="round-button"
          aria-pressed={areVisible}
          aria-label="Ge'ez letters in the background"
          aria-describedby={isPhone ? undefined : cardId}
          onClick={isPhone ? () => setIsSheetOpen(true) : switchLetters}
          // Touch screens wider than a phone have no hover, so a tap also shows the card.
          onPointerUp={(event) => {
            if (!isPhone && event.pointerType !== "mouse") open();
          }}
        >
          <span lang="am" aria-hidden="true">
            ሀ
          </span>
        </button>
      </span>

      {isPhone ? (
        <PhoneSheet isOpen={isSheetOpen} onClose={closeSheet} label="Ge'ez letters">
          <LessonContent lesson={lessons.fidel} />
          <label className={styles.switchRow}>
            Letters in the background
            <input type="checkbox" role="switch" checked={areVisible} onChange={switchLetters} />
          </label>
        </PhoneSheet>
      ) : (
        <div
          ref={setCard}
          id={cardId}
          className={cardStyles.card}
          role="note"
          hidden={!isOpen}
          {...hoverProps}
        >
          <LessonContent lesson={lessons.fidel} />
          <p className={`muted ${styles.cardHint}`}>
            {areVisible ? "Click ሀ to hide the letters." : "Click ሀ to show the letters."}
          </p>
        </div>
      )}
    </>
  );
}

// Clicking only starts and stops the music. Pointing at the button shows the player.
// On phones a tap starts the music if it is off and opens the player as a sheet; it never
// stops or skips the current song (the player has its own controls for that).
function MusicButton({ onOpenSheet }: { onOpenSheet: () => void }) {
  const buttonRef = useMagnetic<HTMLButtonElement>();
  const { isOpen, open, close, setAnchor, setCard, hoverProps } = useHoverCard("beside");
  const cardId = useId();
  const music = useMusicPlayer();
  const isPhone = useIsPhone();

  function handleClick() {
    if (!isPhone) {
      music.toggle();
      return;
    }
    if (!music.isOn) music.toggle();
    onOpenSheet();
  }

  return (
    <>
      <span ref={setAnchor} className={styles.anchor} {...hoverProps}>
        <button
          ref={buttonRef}
          type="button"
          className="round-button"
          aria-pressed={music.isOn}
          aria-label="Music from my Ethiopian playlist"
          aria-describedby={isPhone ? undefined : cardId}
          onClick={handleClick}
          onPointerUp={(event) => {
            // On touch screens wider than a phone, the player shows when the music starts and hides when it stops.
            if (isPhone || event.pointerType === "mouse") return;
            if (music.isOn) close();
            else open();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
        </button>
      </span>
      {!isPhone && (
        <div
          ref={setCard}
          id={cardId}
          className={cardStyles.card}
          role="group"
          aria-label="Music player"
          hidden={!isOpen}
          {...hoverProps}
        >
          <MusicCard />
        </div>
      )}
    </>
  );
}

// Theme, letters and music: a column on the left edge (one pill at the bottom on phones).
// On phones the music player also has a small "now playing" bar and opens as a sheet.
export default function SideControls() {
  const isPhone = useIsPhone();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const openPlayer = useCallback(() => setIsPlayerOpen(true), []);
  const closePlayer = useCallback(() => setIsPlayerOpen(false), []);

  return (
    <>
      <div className={styles.phoneBand} aria-hidden="true" />
      <div className={styles.controls} role="group" aria-label="Site settings">
        <ThemeButton />
        <FidelButton />
        <MusicButton onOpenSheet={openPlayer} />
      </div>
      {isPhone && (
        <>
          {!isPlayerOpen && <MiniPlayer onOpen={openPlayer} />}
          <PhoneSheet isOpen={isPlayerOpen} onClose={closePlayer} label="Music player">
            <MusicCard />
          </PhoneSheet>
        </>
      )}
    </>
  );
}

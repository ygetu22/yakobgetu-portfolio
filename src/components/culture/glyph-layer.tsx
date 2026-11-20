"use client";

import { useEffect, useRef } from "react";
import { closeness, ease } from "@/components/motion/motion-math";
import { pointer, usePointerFrame } from "@/components/motion/pointer-motion";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import { fidelLetters } from "./fidel";
import { useGlyphsVisible } from "./glyph-visibility";
import styles from "./glyph-layer.module.css";

const GLYPH_COUNT = 10;
const MOVE_EVERY_MS = 2600;
const FADE_MS = 800;
// A letter starts to grow once the pointer is this close to it.
const REACH_PX = 170;

// Where a letter sits, in percent of the screen, and how close the pointer currently is (0 to 1).
type Glyph = { left: number; top: number; near: number };

// A random spot that is not on top of another letter.
function freeSpot(glyphs: Glyph[], moving: Glyph) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const left = 4 + Math.random() * 91;
    const top = 5 + Math.random() * 88;
    const isCrowded = glyphs.some(
      (other) => other !== moving && Math.abs(other.left - left) < 10 && Math.abs(other.top - top) < 12,
    );
    if (!isCrowded) return { left, top };
  }
  return { left: moving.left, top: moving.top };
}

// Ge'ez letters scattered behind the page. Every few seconds one fades out and comes back as a
// different letter somewhere else; near the pointer a letter grows and shows how it sounds.
// Purely decorative, so it is hidden from screen readers.
export default function GlyphLayer() {
  const areVisible = useGlyphsVisible();
  const elementRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphs = useRef<Glyph[]>([]);

  useEffect(() => {
    // Start on a loose grid so the first screen is evenly scattered, then let the letters wander.
    glyphs.current = Array.from({ length: GLYPH_COUNT }, (_, index) => ({
      left: 8 + (index % 5) * 21,
      top: 12 + Math.floor(index / 5) * 44,
      near: 0,
    }));

    function place(index: number) {
      const glyph = glyphs.current[index];
      const element = elementRefs.current[index];
      if (!element) return;

      const [letter, sound] = fidelLetters[Math.floor(Math.random() * fidelLetters.length)];
      Object.assign(glyph, freeSpot(glyphs.current, glyph));
      element.style.left = `${glyph.left.toFixed(1)}%`;
      element.style.top = `${glyph.top.toFixed(1)}%`;
      element.firstElementChild!.textContent = letter;
      element.lastElementChild!.textContent = sound;
    }

    glyphs.current.forEach((_, index) => place(index));
    if (prefersReducedMotion()) return;

    let fadeTimer = 0;
    const moveTimer = window.setInterval(() => {
      const index = Math.floor(Math.random() * GLYPH_COUNT);
      const element = elementRefs.current[index];
      if (!element) return;

      element.classList.add(styles.moving);
      fadeTimer = window.setTimeout(() => {
        place(index);
        element.classList.remove(styles.moving);
      }, FADE_MS);
    }, MOVE_EVERY_MS);

    return () => {
      window.clearInterval(moveTimer);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  usePointerFrame(() => {
    glyphs.current.forEach((glyph, index) => {
      const x = (glyph.left / 100) * window.innerWidth;
      const y = (glyph.top / 100) * window.innerHeight;
      const target = pointer.isActive ? closeness(pointer, x, y, REACH_PX) : 0;
      const near = ease(glyph.near, target, 0.12);
      if (Math.abs(near - glyph.near) < 0.001) return;
      glyph.near = near;
      elementRefs.current[index]?.style.setProperty("--near", near.toFixed(3));
    });
  });

  return (
    <div className={`${styles.layer} ${areVisible ? "" : styles.hidden}`} aria-hidden="true">
      {Array.from({ length: GLYPH_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(element) => {
            elementRefs.current[index] = element;
          }}
          className={styles.glyph}
        >
          <span />
          <small />
        </span>
      ))}
    </div>
  );
}

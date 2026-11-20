"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { randomFidelLetter } from "@/components/culture/fidel";
import { closeness, ease } from "./motion-math";
import { pointer, usePointerFrame } from "./pointer-motion";
import { prefersReducedMotion } from "./scroll-frame";
import styles from "./weight-letters.module.css";

// How close the pointer must be before a letter starts to react, and how much heavier it can get.
const REACH_PX = 220;
const EXTRA_WEIGHT = 420;

type WeightLettersProps = {
  text: string;
  // Font weight of the letters when the pointer is far away.
  restingWeight: number;
  // Page titles first appear in Ge'ez letters and settle into English from left to right.
  decodeOnMount?: boolean;
};

// Headline text whose letters get heavier as the pointer comes close. Inside a <Reveal>,
// the letters also rise in one after another. Screen readers get the plain text once.
export default function WeightLetters({ text, restingWeight, decodeOnMount = false }: WeightLettersProps) {
  const groupRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const weights = useRef<number[]>([]);
  const isOnScreen = useRef(false);
  const characters = [...text];

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const observer = new IntersectionObserver(([entry]) => {
      isOnScreen.current = entry.isIntersecting;
    });
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!decodeOnMount || prefersReducedMotion()) return;

    const letters = letterRefs.current;
    const timers = [...text].map((character, index) => {
      const letter = letters[index];
      if (!letter || character === " ") return 0;

      const settleAt = performance.now() + 350 + index * 110;
      letter.textContent = randomFidelLetter();
      const timer = window.setInterval(() => {
        const hasSettled = performance.now() >= settleAt;
        letter.textContent = hasSettled ? character : randomFidelLetter();
        if (hasSettled) window.clearInterval(timer);
      }, 80);
      return timer;
    });

    return () => {
      timers.forEach((timer) => window.clearInterval(timer));
      // Leave the real text in place if the effect is cut short.
      [...text].forEach((character, index) => {
        const letter = letters[index];
        if (letter) letter.textContent = character;
      });
    };
  }, [decodeOnMount, text]);

  usePointerFrame(() => {
    if (!isOnScreen.current) return;

    letterRefs.current.forEach((letter, index) => {
      if (!letter) return;
      const box = letter.getBoundingClientRect();
      const near = pointer.isActive
        ? closeness(pointer, box.left + box.width / 2, box.top + box.height / 2, REACH_PX)
        : 0;
      const current = weights.current[index] ?? restingWeight;
      const next = ease(current, restingWeight + near * EXTRA_WEIGHT, 0.14);
      if (Math.abs(next - current) < 0.5) return;
      weights.current[index] = next;
      letter.style.fontVariationSettings = `"wght" ${next.toFixed(0)}`;
    });
  });

  return (
    <span ref={groupRef} className={styles.group}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {characters.map((character, index) => (
          <span
            key={index}
            ref={(element) => {
              letterRefs.current[index] = element;
            }}
            className={styles.letter}
            style={
              {
                "--letter-index": index,
                fontVariationSettings: `"wght" ${restingWeight}`,
              } as CSSProperties
            }
          >
            {character}
          </span>
        ))}
      </span>
    </span>
  );
}

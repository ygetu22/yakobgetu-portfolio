"use client";

import { useRef, useState } from "react";
import { clamp } from "./motion-math";
import { prefersReducedMotion, useScrollFrame } from "./scroll-frame";
import styles from "./read-along.module.css";

type ReadAlongProps = {
  text: string;
  className?: string;
};

// A paragraph that brightens word by word as it is scrolled through.
export default function ReadAlong({ text, className = "" }: ReadAlongProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const words = text.trim().split(/\s+/);
  // Before the first scroll measurement (and without JavaScript) every word is readable.
  const [readCount, setReadCount] = useState(words.length);

  useScrollFrame(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph || prefersReducedMotion()) return;

    const box = paragraph.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = clamp((viewportHeight * 0.88 - box.top) / (box.height + viewportHeight * 0.3), 0, 1);
    setReadCount(Math.round(progress * words.length));
  });

  return (
    <p ref={paragraphRef} className={`${styles.paragraph} ${className}`}>
      {words.map((word, index) => (
        <span key={index} className={index < readCount ? styles.read : styles.unread}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

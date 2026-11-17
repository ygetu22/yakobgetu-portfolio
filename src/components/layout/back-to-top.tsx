"use client";

import { useState } from "react";
import { useMagnetic } from "@/components/motion/magnetic";
import { useScrollFrame } from "@/components/motion/scroll-frame";
import styles from "./back-to-top.module.css";

// Appears after the first screen. At the very end of the page it opens up and says what it does.
export default function BackToTop() {
  const buttonRef = useMagnetic<HTMLButtonElement>();
  const [isVisible, setIsVisible] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useScrollFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    setIsVisible(window.scrollY > window.innerHeight * 0.8);
    setIsAtEnd(scrollable - window.scrollY < 80);
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.button} ${isVisible ? styles.visible : ""} ${isAtEnd ? styles.atEnd : ""}`}
      aria-label="Back to top"
      // Out of the tab order while it is invisible.
      tabIndex={isVisible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <span className={styles.label} aria-hidden="true">
        Back to top
      </span>
      <span aria-hidden="true">↑</span>
    </button>
  );
}

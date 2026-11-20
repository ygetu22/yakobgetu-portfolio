"use client";

import { useRef } from "react";
import { clamp } from "@/components/motion/motion-math";
import { useScrollFrame } from "@/components/motion/scroll-frame";
import styles from "./scroll-progress.module.css";

// A thin line across the top of the screen that fills as the page is read. Decorative only.
export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
  });

  return <div ref={fillRef} className={styles.fill} aria-hidden="true" />;
}

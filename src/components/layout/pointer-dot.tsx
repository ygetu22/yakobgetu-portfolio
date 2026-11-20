"use client";

import { useRef } from "react";
import { ease } from "@/components/motion/motion-math";
import { pointer, usePointerFrame } from "@/components/motion/pointer-motion";
import styles from "./pointer-dot.module.css";

// A small dot that trails the mouse. Over a link or button it opens into a ring, and over an
// element marked data-cursor="word" the ring shows that word (open, copy, visit, view, next).
// An element marked data-cursor-hide (the floating project preview's list) hides it.
// Decorative only: it never replaces the real cursor and is hidden from screen readers.
export default function PointerDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const position = useRef({ x: 0, y: 0 });

  usePointerFrame(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    position.current.x = ease(position.current.x, pointer.x, 0.22);
    position.current.y = ease(position.current.y, pointer.y, 0.22);
    dot.style.transform = `translate(${position.current.x.toFixed(1)}px, ${position.current.y.toFixed(1)}px)`;

    const under = pointer.isActive ? document.elementFromPoint(pointer.x, pointer.y) : null;
    const labelled = under?.closest<HTMLElement>("[data-cursor]");
    const isHidden = !pointer.isActive || Boolean(under?.closest("[data-cursor-hide]"));

    if (labelled) label.textContent = labelled.dataset.cursor ?? "";
    dot.classList.toggle(styles.visible, !isHidden);
    dot.classList.toggle(styles.labelled, Boolean(labelled));
    dot.classList.toggle(styles.overLink, !labelled && Boolean(under?.closest("a, button")));
  });

  return (
    <div ref={dotRef} className={styles.dot} aria-hidden="true">
      <span ref={labelRef} />
    </div>
  );
}

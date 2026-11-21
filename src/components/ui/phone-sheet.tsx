"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./phone-sheet.module.css";

// Pulling the sheet down this far (in px) closes it.
const SWIPE_CLOSE_PX = 90;

type PhoneSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
};

// A panel that slides up from the bottom of a phone screen over a dimmed page, like an iOS sheet.
// It closes from the Done button, a tap on the dimmed page, Escape, or a swipe down on its handle.
// While it is open the page behind it does not scroll, and focus returns to where it was after.
export default function PhoneSheet({ isOpen, onClose, label, children }: PhoneSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    document.documentElement.classList.add(styles.locked);

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.documentElement.classList.remove(styles.locked);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function followDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartY.current === null || !panelRef.current) return;
    const pulledDown = Math.max(0, event.clientY - dragStartY.current);
    panelRef.current.style.translate = `0 ${pulledDown}px`;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartY.current === null || !panelRef.current) return;
    const pulledDown = event.clientY - dragStartY.current;
    dragStartY.current = null;
    panelRef.current.style.translate = "";
    if (pulledDown > SWIPE_CLOSE_PX) onClose();
  }

  // Rendered into <body> so no transformed or filtered parent can change where it sits.
  return createPortal(
    <div className={styles.layer}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
        <div
          className={styles.handleArea}
          onPointerDown={(event) => {
            // A press on Done is a tap, not the start of a drag.
            if ((event.target as HTMLElement).closest("button")) return;
            dragStartY.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={followDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className={styles.handle} aria-hidden="true" />
          <button type="button" className={styles.done} onClick={onClose}>
            Done
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

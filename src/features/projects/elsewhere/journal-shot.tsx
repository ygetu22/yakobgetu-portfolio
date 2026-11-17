"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { JournalPhoto } from "./journal-data";
import ShotActions from "./shot-actions";
import type { useReactions } from "./use-reactions";
import styles from "./journal.module.css";

// The reveal takes this long; after it, its slow transition is dropped so the parallax tracks the scroll exactly.
const SETTLE_MS = 1700;

type JournalShotProps = {
  photo: JournalPhoto;
  // Position in the whole journal, starting at 1.
  number: number;
  // Tall photos take turns on the left and right so the page has some rhythm.
  isOnRight: boolean;
  // Hidden while the viewer is showing this photo, so the two never overlap.
  isInViewer: boolean;
  reactions: ReturnType<typeof useReactions>;
  onOpen: () => void;
};

// One photo on the journal page. It is uncovered from the bottom up the first time it scrolls into view.
export default function JournalShot({ photo, number, isOnRight, isInViewer, reactions, onOpen }: JournalShotProps) {
  const figureRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    let settleTimer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        settleTimer = window.setTimeout(() => setIsSettled(true), SETTLE_MS);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(figure);

    return () => {
      observer.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  const classNames = [
    styles.shot,
    isOnRight ? styles.right : "",
    isVisible ? styles.visible : "",
    isSettled ? styles.settled : "",
    isInViewer ? styles.inViewer : "",
  ].join(" ");

  return (
    <figure
      ref={figureRef}
      id={`shot-${photo.id}`}
      className={classNames}
      // --ratio (width divided by height) sizes the figure, so the photo is never cropped.
      style={{ "--ratio": (photo.width / photo.height).toFixed(4) } as CSSProperties}
    >
      <button
        type="button"
        className={styles.frame}
        aria-label={`Open the photo larger: ${photo.place}, ${photo.date}`}
        data-cursor="view"
        data-shot-frame
        onClick={onOpen}
      >
        <Image
          src={photo.image}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 800px) 100vw, 60vw"
        />
      </button>
      <ShotActions photo={photo} reactions={reactions} />
      <figcaption>
        <span className={styles.number} aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        <span className={`display-heading ${styles.place}`}>{photo.place}</span>
        <span className={styles.date}>{photo.date}</span>
      </figcaption>
    </figure>
  );
}

"use client";

import { useId } from "react";
import type { TimelineEntry } from "./resume-data";
import styles from "./resume.module.css";

type ResumeEntryProps = {
  entry: TimelineEntry;
  isOpen: boolean;
  onToggle: () => void;
  // True once the reader has scrolled past this row (fills its dot on the timeline).
  isPassed?: boolean;
};

// One job or role: a row that opens to show what was done there.
export default function ResumeEntry({ entry, isOpen, onToggle, isPassed = false }: ResumeEntryProps) {
  const detailsId = useId();

  return (
    <li
      id={`entry-${entry.id}`}
      className={`${styles.entry} ${isOpen ? styles.open : ""} ${isPassed ? styles.passed : ""}`}
    >
      <button
        type="button"
        className={styles.entryHead}
        aria-expanded={isOpen}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span>
          <span className={`display-heading ${styles.entryName}`}>{entry.name}</span>
          <span className={styles.entryRole}>{entry.role}</span>
        </span>
        <span className={styles.entryWhen}>
          {entry.date}
          <br />
          {entry.location}
        </span>
        <span className={styles.entrySign} aria-hidden="true">
          +
        </span>
      </button>

      {/* `inert` keeps the collapsed details away from keyboards and screen readers. */}
      <div id={detailsId} className={styles.entryBody} inert={!isOpen}>
        <div>
          {entry.stack && <p className={styles.entryStack}>{entry.stack.join(" · ")}</p>}
          <ul className={`plain-list ${styles.entryBullets}`}>
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

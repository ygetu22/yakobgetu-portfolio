"use client";

import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useHoverCard } from "@/components/ui/hover-card";
import cardStyles from "@/components/ui/hover-card.module.css";
import { useIsInBrowser } from "@/components/ui/use-is-in-browser";
import { lessons, type Lesson, type LessonName } from "./lessons";
import styles from "./learn.module.css";

// The inside of a lesson card: what the thing is, an optional sample, and where to read more.
export function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <p className={`display-heading ${styles.title}`}>{lesson.title}</p>
      <p className={styles.text}>{lesson.text}</p>
      {lesson.example && (
        <p className={styles.example}>
          <span className="display-heading" lang="am">
            {lesson.example}
          </span>
          <small>{lesson.exampleSound}</small>
        </p>
      )}
      {lesson.source && (
        <a className={`text-link ${styles.source}`} href={lesson.source.url} target="_blank" rel="noreferrer">
          Learn more<span className="sr-only">: {lesson.source.label} (opens in a new tab)</span>
          <span aria-hidden="true"> ↗</span>
        </a>
      )}
    </>
  );
}

type LearnProps = {
  lesson: LessonName;
  // The element that carries the lesson. Use "span" inside text and "div" for blocks.
  as?: "span" | "div" | "p";
  className?: string;
  children?: ReactNode;
  // What a screen reader should call the element when it has no text of its own (e.g. the tibeb band).
  label?: string;
};

// Wraps something Ethiopian on the page. Pointing at it, or focusing it with the keyboard,
// shows a short explanation with a link to learn more. Tapping does the same on touch screens.
export default function Learn({ lesson, as: Tag = "span", className = "", children, label }: LearnProps) {
  const { isOpen, toggle, setAnchor, setCard, hoverProps } = useHoverCard();
  const cardId = useId();
  const isInBrowser = useIsInBrowser();

  return (
    <>
      <Tag
        ref={setAnchor}
        className={`${styles.anchor} ${className}`}
        tabIndex={0}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-describedby={cardId}
        // Touch screens have no hover, so a tap opens and closes the card.
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") toggle();
        }}
        {...hoverProps}
      >
        {children}
      </Tag>
      {/* The card is placed at the end of <body>, because the anchor may sit inside a paragraph
          or heading, where a block of content is not allowed. */}
      {isInBrowser &&
        createPortal(
          <div ref={setCard} id={cardId} className={cardStyles.card} role="note" hidden={!isOpen} {...hoverProps}>
            <LessonContent lesson={lessons[lesson]} />
          </div>,
          document.body,
        )}
    </>
  );
}

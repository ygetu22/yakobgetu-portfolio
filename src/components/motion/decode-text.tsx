"use client";

import { useEffect, useRef, useState } from "react";
import { randomFidelLetter } from "@/components/culture/fidel";
import { prefersReducedMotion } from "./scroll-frame";

const SETTLE_INTERVAL_MS = 45;

// Text made of Ge'ez letters with the first `settledCount` characters already in English.
function scrambled(text: string, settledCount: number): string {
  let result = text.slice(0, settledCount);
  for (const character of text.slice(settledCount)) {
    result += character === " " ? " " : randomFidelLetter();
  }
  return result;
}

// Small labels that first appear in Ge'ez letters, then settle into English one character at a time.
// Screen readers always get the real text.
export default function DecodeText({ text }: { text: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [shownText, setShownText] = useState(text);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion()) return;

    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      let settledCount = 0;
      timer = window.setInterval(() => {
        settledCount += 1;
        setShownText(scrambled(text, settledCount));
        if (settledCount >= text.length) window.clearInterval(timer);
      }, SETTLE_INTERVAL_MS);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [text]);

  return (
    <span ref={elementRef}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shownText}</span>
    </span>
  );
}

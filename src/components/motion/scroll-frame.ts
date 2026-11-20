"use client";

import { useEffect, useEffectEvent } from "react";

// Scroll and resize events can fire many times per frame. Everything that reacts to scrolling
// subscribes here, so the work happens once per frame behind one pair of listeners.

const scrollCallbacks = new Set<() => void>();
let isUpdateQueued = false;

function runCallbacks() {
  isUpdateQueued = false;
  scrollCallbacks.forEach((callback) => callback());
}

function queueUpdate() {
  if (isUpdateQueued) return;
  isUpdateQueued = true;
  window.requestAnimationFrame(runCallbacks);
}

function onScrollFrame(callback: () => void): () => void {
  if (scrollCallbacks.size === 0) {
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
  }
  scrollCallbacks.add(callback);
  // Run once now so the effect is correct before the first scroll.
  callback();

  return () => {
    scrollCallbacks.delete(callback);
    if (scrollCallbacks.size === 0) {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    }
  };
}

export function useScrollFrame(callback: () => void) {
  const runCallback = useEffectEvent(callback);
  useEffect(() => onScrollFrame(() => runCallback()), []);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

"use client";

import { useEffect, useState } from "react";

// "⌘K" on a Mac, "Ctrl K" elsewhere, and plain "Search" where there is no keyboard.
export function useShortcutLabel(): string {
  const [label, setLabel] = useState("⌘K");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hasKeyboard = window.matchMedia("(hover: hover)").matches;
      const isApple = /Mac|iPhone|iPad/.test(navigator.platform);
      setLabel(hasKeyboard ? (isApple ? "⌘K" : "Ctrl K") : "Search");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return label;
}

// The search shortcut written out as a key, for use inside a sentence.
export function ShortcutKey() {
  return <kbd>{useShortcutLabel()}</kbd>;
}

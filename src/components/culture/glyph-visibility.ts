"use client";

import { useSyncExternalStore } from "react";

// Whether the drifting Ge'ez letters in the background are shown. The ሀ button and the
// site search can both switch them, so the setting lives here rather than in one component.

let areVisible = true;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toggleGlyphs(): boolean {
  areVisible = !areVisible;
  listeners.forEach((listener) => listener());
  return areVisible;
}

export function useGlyphsVisible(): boolean {
  return useSyncExternalStore(subscribe, () => areVisible, () => true);
}

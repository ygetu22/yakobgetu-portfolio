"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "elsewhere:saved-photos";
const listeners = new Set<() => void>();

// Used when browser storage is blocked (private windows, strict settings),
// so saving still works until the page is closed.
let unsavedFallback = "[]";

function readStored(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return unsavedFallback;
  }
}

function writeStored(value: string) {
  unsavedFallback = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage is blocked; the fallback above keeps this visit working.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  // Keeps other open tabs in sync when a photo is saved in one of them.
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

function parseIds(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

// Remembers which photos a visitor saved. It lives in their own browser only:
// no account or server, so saves stay on that device.
export function useSavedPhotos(knownIds: string[]) {
  // The server has no saved photos, so it renders the same "nothing saved" HTML as a first visit.
  const raw = useSyncExternalStore(subscribe, readStored, () => "[]");

  // Ignore anything that isn't a current photo, e.g. a photo removed later.
  const saved = new Set(parseIds(raw).filter((id) => knownIds.includes(id)));

  function toggle(id: string) {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStored(JSON.stringify([...next]));
  }

  return { saved, toggle };
}

"use client";

import { useSyncExternalStore } from "react";

// Remembers a set of photo IDs in the visitor's own browser, such as the photos
// they saved. There is no account or server, so it stays on that device.
// Storage can be blocked (private windows, strict settings), so every read and
// write is allowed to fail; the in-memory copy keeps the current visit working.

const listeners = new Map<string, Set<() => void>>();
const unsavedFallback = new Map<string, string>();

function readStored(storageKey: string): string {
  try {
    return localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return unsavedFallback.get(storageKey) ?? "[]";
  }
}

function writeStored(storageKey: string, value: string) {
  unsavedFallback.set(storageKey, value);
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // Storage is blocked; the fallback above keeps this visit working.
  }
  listeners.get(storageKey)?.forEach((notify) => notify());
}

// One subscribe function per key, so React doesn't resubscribe on every render.
const subscribers = new Map<string, (notify: () => void) => () => void>();

function subscribeTo(storageKey: string) {
  const existing = subscribers.get(storageKey);
  if (existing) return existing;
  const subscribe = (notify: () => void) => {
    const keyListeners = listeners.get(storageKey) ?? new Set();
    keyListeners.add(notify);
    listeners.set(storageKey, keyListeners);
    // Keeps other open tabs in sync.
    window.addEventListener("storage", notify);
    return () => {
      keyListeners.delete(notify);
      window.removeEventListener("storage", notify);
    };
  };
  subscribers.set(storageKey, subscribe);
  return subscribe;
}

function parseIds(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function usePhotoSet(storageKey: string, knownIds: string[]) {
  // The server has nothing stored, so it renders the same HTML as a first visit.
  const raw = useSyncExternalStore(subscribeTo(storageKey), () => readStored(storageKey), () => "[]");

  // Ignore anything that isn't a current photo, e.g. a photo removed later.
  const ids = new Set(parseIds(raw).filter((id) => knownIds.includes(id)));

  function toggle(id: string) {
    const next = new Set(ids);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStored(storageKey, JSON.stringify([...next]));
  }

  return { ids, toggle };
}

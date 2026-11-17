"use client";

import { useSyncExternalStore } from "react";
import type { Reaction } from "./reaction";

// A visitor's likes, reposts and comments on journal photos.
//
// They are remembered in the visitor's own browser, so the hearts stay filled on their next
// visit. Each new reaction is also sent to the server, which emails Yakob about it. Nothing is
// shown to other visitors, so there are no public comments to moderate.

const STORAGE_KEY = "elsewhere-reactions";
const MAX_COMMENTS_PER_PHOTO = 20;

type SavedReactions = {
  likes: string[];
  reposts: string[];
  comments: Record<string, string[]>;
};

const EMPTY: SavedReactions = { likes: [], reposts: [], comments: {} };
const EMPTY_JSON = JSON.stringify(EMPTY);

// Storage can be blocked (private windows, strict settings). This copy keeps the visit working.
let unsavedFallback = EMPTY_JSON;
const listeners = new Set<() => void>();

function readStored(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? unsavedFallback;
  } catch {
    return unsavedFallback;
  }
}

function writeStored(reactions: SavedReactions) {
  unsavedFallback = JSON.stringify(reactions);
  try {
    localStorage.setItem(STORAGE_KEY, unsavedFallback);
  } catch {
    // Storage is blocked; the fallback above is used instead.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keeps other open tabs in step.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

// Stored data may be old or edited by hand, so nothing in it is assumed to have the right shape.
function parseSaved(raw: string): SavedReactions {
  try {
    const saved = JSON.parse(raw) as Partial<Record<keyof SavedReactions, unknown>>;
    const comments: Record<string, string[]> = {};
    if (typeof saved.comments === "object" && saved.comments !== null) {
      for (const [photoId, list] of Object.entries(saved.comments)) comments[photoId] = stringList(list);
    }
    return { likes: stringList(saved.likes), reposts: stringList(saved.reposts), comments };
  } catch {
    return EMPTY;
  }
}

// Tells the server, which lets Yakob know. Returns whether it got through.
async function notify(reaction: Reaction): Promise<boolean> {
  try {
    const response = await fetch("/api/elsewhere/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reaction),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function useReactions() {
  // The server has nothing stored, so it renders the same HTML as a first visit.
  const raw = useSyncExternalStore(subscribe, readStored, () => EMPTY_JSON);
  const saved = parseSaved(raw);

  function toggleLike(photoId: string) {
    const isLiked = saved.likes.includes(photoId);
    const likes = isLiked ? saved.likes.filter((id) => id !== photoId) : [...saved.likes, photoId];
    writeStored({ ...saved, likes });
    if (!isLiked) void notify({ photoId, kind: "like" });
  }

  function markReposted(photoId: string) {
    if (saved.reposts.includes(photoId)) return;
    writeStored({ ...saved, reposts: [...saved.reposts, photoId] });
    void notify({ photoId, kind: "repost" });
  }

  // Returns false when this photo already has as many comments as one browser may add.
  function addComment(photoId: string, comment: string): Promise<boolean> | false {
    const existing = saved.comments[photoId] ?? [];
    if (existing.length >= MAX_COMMENTS_PER_PHOTO) return false;

    writeStored({ ...saved, comments: { ...saved.comments, [photoId]: [...existing, comment] } });
    return notify({ photoId, kind: "comment", comment });
  }

  return {
    isLiked: (photoId: string) => saved.likes.includes(photoId),
    isReposted: (photoId: string) => saved.reposts.includes(photoId),
    commentsOn: (photoId: string) => saved.comments[photoId] ?? [],
    toggleLike,
    markReposted,
    addComment,
  };
}

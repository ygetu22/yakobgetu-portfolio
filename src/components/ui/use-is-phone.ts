"use client";

import { useSyncExternalStore } from "react";

// Matches the phone layout in the CSS modules (`@media (max-width: 800px)`).
export const PHONE_QUERY = "(max-width: 800px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// True on a phone-sized screen. False on the server and during the first browser render,
// so phone-only parts appear right after the page loads instead of causing a hydration mismatch.
export function useIsPhone(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}

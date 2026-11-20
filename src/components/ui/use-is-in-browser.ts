"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

// False while the page is rendered on the server and during the first browser render, true after.
// Use it for anything the server cannot know: the saved theme, today's date, `document`.
export function useIsInBrowser(): boolean {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

// Links such as /#entry-jpmc-2026 point at one thing on a page. This file is how the site
// reacts to them: components read the current #hash, and the target is scrolled to and
// briefly highlighted so the visitor sees where a search or link took them.

function subscribeToHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

// The part of the address after "#", without the "#". Empty on the server.
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribeToHash,
    () => decodeURIComponent(window.location.hash.slice(1)),
    () => "",
  );
}

// Goes to something on the current page. Unlike a plain link, this also works when the
// address already ends in the same #hash (the browser would otherwise do nothing).
export function goToHash(id: string) {
  if (decodeURIComponent(window.location.hash.slice(1)) === id) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = id;
  }
}

const FLASH_MS = 1900;
// Wait for the page transition curtain to lift before highlighting on a new page.
const ARRIVAL_DELAY_MS = 1100;

function showTarget(id: string) {
  const target = id ? document.getElementById(id) : null;
  if (!target) return;

  // Whole sections scroll to their top; a single row, skill or photo is centred.
  target.scrollIntoView({ block: target.matches("section") ? "start" : "center" });
  target.classList.remove("is-flash");
  void target.offsetWidth; // restarts the highlight if it was already running
  target.classList.add("is-flash");
  window.setTimeout(() => target.classList.remove("is-flash"), FLASH_MS);
}

// Mounted once in the root layout.
export function HashTargetHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    const showCurrentTarget = () => showTarget(decodeURIComponent(window.location.hash.slice(1)));
    window.addEventListener("hashchange", showCurrentTarget);
    return () => window.removeEventListener("hashchange", showCurrentTarget);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => showTarget(decodeURIComponent(window.location.hash.slice(1))),
      ARRIVAL_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

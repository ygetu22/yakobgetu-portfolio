"use client";

import { useSyncExternalStore } from "react";
import styles from "./toast.module.css";

// One short status message at the bottom of the screen ("Email copied").
// Any component can call showToast(); the <Toast /> in the root layout displays it.

const VISIBLE_MS = 1800;

let message = "";
let isVisible = false;
let hideTimer = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function showToast(nextMessage: string) {
  message = nextMessage;
  isVisible = true;
  notify();

  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => {
    isVisible = false;
    notify();
  }, VISIBLE_MS);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export default function Toast() {
  const shownMessage = useSyncExternalStore(subscribe, () => message, () => "");
  const isShown = useSyncExternalStore(subscribe, () => isVisible, () => false);

  return (
    <div className={`${styles.toast} ${isShown ? styles.visible : ""}`} role="status">
      {shownMessage}
    </div>
  );
}

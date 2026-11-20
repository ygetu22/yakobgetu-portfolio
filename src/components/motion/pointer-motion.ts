"use client";

import { useEffect, useEffectEvent } from "react";

// One pointer tracker and one animation loop shared by every pointer-driven effect on the site
// (reactive letters, tilting pictures, magnetic buttons, the trailing dot). Sharing them means a
// page full of effects still does a single read of the pointer and a single frame callback.

export const pointer = { x: 0, y: 0, isActive: false };

const frameCallbacks = new Set<() => void>();
let frameId = 0;

// Touch screens have no pointer to follow, and reduced-motion visitors asked for less movement.
export function canFollowPointer(): boolean {
  return (
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function handlePointerMove(event: PointerEvent) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.isActive = true;
}

function handlePointerLeave() {
  pointer.isActive = false;
}

function runFrame() {
  frameCallbacks.forEach((callback) => callback());
  frameId = window.requestAnimationFrame(runFrame);
}

function startLoop() {
  window.addEventListener("pointermove", handlePointerMove);
  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  frameId = window.requestAnimationFrame(runFrame);
}

function stopLoop() {
  window.removeEventListener("pointermove", handlePointerMove);
  document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
  window.cancelAnimationFrame(frameId);
}

// Runs `callback` on every animation frame until the returned function is called.
function onPointerFrame(callback: () => void): () => void {
  if (!canFollowPointer()) return () => {};

  if (frameCallbacks.size === 0) startLoop();
  frameCallbacks.add(callback);

  return () => {
    frameCallbacks.delete(callback);
    if (frameCallbacks.size === 0) stopLoop();
  };
}

export function usePointerFrame(callback: () => void) {
  const runCallback = useEffectEvent(callback);
  useEffect(() => onPointerFrame(() => runCallback()), []);
}

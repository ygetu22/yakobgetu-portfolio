"use client";

import { useRef, type RefObject } from "react";
import { ease } from "./motion-math";
import { pointer, usePointerFrame } from "./pointer-motion";

const PULL_DISTANCE_PX = 42;
const PULL_STRENGTH = 0.35;

// Pulls a small round button a little toward the pointer when it comes near.
export function useMagnetic<T extends HTMLElement>(): RefObject<T | null> {
  const elementRef = useRef<T>(null);
  const offset = useRef({ x: 0, y: 0 });

  usePointerFrame(() => {
    const element = elementRef.current;
    if (!element) return;

    const box = element.getBoundingClientRect();
    // Measure from where the button rests, not from where the pull has already moved it.
    const restX = box.left + box.width / 2 - offset.current.x;
    const restY = box.top + box.height / 2 - offset.current.y;
    const isNear =
      pointer.isActive && Math.hypot(pointer.x - restX, pointer.y - restY) < PULL_DISTANCE_PX;

    offset.current.x = ease(offset.current.x, isNear ? (pointer.x - restX) * PULL_STRENGTH : 0, 0.15);
    offset.current.y = ease(offset.current.y, isNear ? (pointer.y - restY) * PULL_STRENGTH : 0, 0.15);
    element.style.transform = `translate(${offset.current.x.toFixed(1)}px, ${offset.current.y.toFixed(1)}px)`;
  });

  return elementRef;
}

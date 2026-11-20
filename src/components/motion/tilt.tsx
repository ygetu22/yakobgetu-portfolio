"use client";

import { useRef, type ReactNode } from "react";
import { ease } from "./motion-math";
import { pointer, usePointerFrame } from "./pointer-motion";
import styles from "./tilt.module.css";

type TiltProps = {
  children: ReactNode;
  className?: string;
};

// A picture that leans toward the pointer. Its shadow falls the other way, as if the pointer were a lamp.
export default function Tilt({ children, className = "" }: TiltProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const lean = useRef({ x: 0, y: 0 });

  usePointerFrame(() => {
    const element = elementRef.current;
    if (!element) return;

    const box = element.getBoundingClientRect();
    const isOnScreen = box.bottom > 0 && box.top < window.innerHeight;
    if (!isOnScreen) return;

    const offsetX = (pointer.x - (box.left + box.width / 2)) / window.innerWidth;
    const offsetY = (pointer.y - (box.top + box.height / 2)) / window.innerHeight;
    lean.current.x = ease(lean.current.x, pointer.isActive ? offsetX : 0, 0.07);
    lean.current.y = ease(lean.current.y, pointer.isActive ? offsetY : 0, 0.07);

    const { x, y } = lean.current;
    element.style.transform = `rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg)`;
    element.style.setProperty("--shadow-x", `${(-x * 70).toFixed(1)}px`);
    element.style.setProperty("--shadow-y", `${(25 - y * 60).toFixed(1)}px`);
  });

  return (
    <div className={styles.stage}>
      <div ref={elementRef} className={`${styles.tilt} ${className}`}>
        {children}
      </div>
    </div>
  );
}

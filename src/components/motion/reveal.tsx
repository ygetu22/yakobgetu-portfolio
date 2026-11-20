"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./reveal.module.css";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

// Fades its content up the first time it scrolls into view.
export default function Reveal({ children, className = "" }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      // "reveal" and "is-visible" are plain class names so child effects (weight-letters) can follow along.
      className={`reveal ${styles.reveal} ${isVisible ? `is-visible ${styles.visible}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

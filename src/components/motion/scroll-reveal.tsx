"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "title" | "portrait" | "wipe" | "from-left" | "from-right" | "unfold" | "settle";
};

export default function ScrollReveal({ children, className, delay = 0, variant = "rise" }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal reveal-${variant}${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

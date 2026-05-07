"use client";

import { useRef, useEffect } from "react";

export default function DarkModeSpotlight({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;

    const setVars = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${clientY - rect.top}px`);
    };

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setVars(e.clientX, e.clientY));
    };

    // Initialize to a pleasant position before the first mouse move.
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${rect.width / 2}px`);
    el.style.setProperty("--spotlight-y", `${rect.height / 3}px`);

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 hidden dark:block ${className ?? ""}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at var(--spotlight-x) var(--spotlight-y), color-mix(in srgb, var(--foreground) 14%, transparent), transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(1100px circle at var(--spotlight-x) var(--spotlight-y), color-mix(in srgb, var(--foreground) 9%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}

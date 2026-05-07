"use client";

import { useState, useEffect } from "react";

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 260);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={[
        "fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center",
        "rounded-2xl border border-black/10 bg-background/85 text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-md",
        "transition-all duration-300 hover:-translate-y-1 hover:opacity-90 dark:border-white/10 dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <span className="sr-only">Back to top</span>
      <ArrowUpIcon />
    </button>
  );
}

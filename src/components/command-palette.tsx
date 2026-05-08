"use client";

import { useCallback, useEffect, useRef, useState, type SVGProps } from "react";
import { useRouter } from "next/navigation";

type Page = {
  label: string;
  href: string;
  description: string;
};

const pages: Page[] = [
  { label: "Home",     href: "/",        description: "Back to the start" },
  { label: "Resume",   href: "/resume",  description: "Experience, skills, and education" },
  { label: "Projects", href: "/projects",description: "Things I've built" },
  { label: "Posts",    href: "/posts",   description: "Writing and updates" },
  { label: "Hobbies",  href: "/hobbies", description: "Outside of work" },
  { label: "Contact",  href: "/contact", description: "Get in touch" },
];

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState("");
  const [activeIndex, setActive]  = useState(0);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const activeItemRef             = useRef<HTMLButtonElement>(null);

  const filtered = pages.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Reset selection when query changes
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep active item in view
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = filtered[activeIndex];
      if (target) navigate(target.href);
    }
  }

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 text-xs font-medium text-foreground/55 transition hover:bg-black/[0.06] hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/50 dark:hover:bg-white/[0.08] dark:hover:text-foreground"
      >
        <SearchIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:block">⌘K</span>
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50" />

          {/* Palette card */}
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 bg-background shadow-[0_24px_80px_rgba(0,0,0,0.14)] dark:border-white/10 dark:bg-[#111] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            onKeyDown={onKeyDown}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
              <SearchIcon className="h-4 w-4 shrink-0 text-foreground/35" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/35 outline-none"
              />
              <kbd className="hidden rounded border border-black/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground/35 dark:border-white/10 sm:block">
                esc
              </kbd>
            </div>

            {/* Results */}
            <ul
              className="max-h-72 overflow-y-auto py-1.5"
              role="listbox"
              aria-label="Pages"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-foreground/40">
                  No results for &ldquo;{query}&rdquo;
                </li>
              ) : (
                filtered.map((page, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <li key={page.href} role="option" aria-selected={isActive}>
                      <button
                        ref={isActive ? activeItemRef : null}
                        type="button"
                        onClick={() => navigate(page.href)}
                        onMouseEnter={() => setActive(i)}
                        className={[
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          isActive
                            ? "bg-black/[0.05] dark:bg-white/[0.07]"
                            : "",
                        ].join(" ")}
                      >
                        <span className="flex-1 text-sm font-medium">
                          {page.label}
                        </span>
                        <span className="hidden text-xs text-foreground/40 sm:block">
                          {page.description}
                        </span>
                        <span className="rounded border border-black/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/35 dark:border-white/10">
                          page
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {/* Footer hints */}
            <div className="border-t border-black/10 px-4 py-2 dark:border-white/10">
              <span className="text-[10px] text-foreground/30">
                <kbd className="font-sans">↑↓</kbd> navigate &nbsp;·&nbsp;
                <kbd className="font-sans">↵</kbd> open &nbsp;·&nbsp;
                <kbd className="font-sans">esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

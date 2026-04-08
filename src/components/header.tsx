"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";

const navLinks = [
  { href: "/resume", label: "resume" },
  { href: "/posts", label: "posts" },
  { href: "/projects", label: "projects" },
  { href: "/hobbies", label: "hobbies" },
  { href: "/contact", label: "contact" },
];

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.35-1.18-3.35-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0112 6.8c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.21 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 8.5H4.5V24H0.5zM8.5 8.5h3.83v2.11h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V24h-4v-8.26c0-1.97-.04-4.5-2.74-4.5-2.74 0-3.16 2.14-3.16 4.36V24h-4z" />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 009.8 9.8z" />
    </svg>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-black/[0.06] hover:text-foreground dark:hover:bg-white/[0.08]"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}

function IconButton(props: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const { href, label, children } = props;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-black/[0.06] hover:text-foreground dark:hover:bg-white/[0.08]"
    >
      {children}
    </a>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function MobileMenu(props: { onNavigate: () => void; pathname: string }) {
  const { onNavigate, pathname } = props;

  return (
    <div className="flex flex-col gap-1 p-2 text-sm">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "rounded-xl px-3 py-2 transition",
              isActive
                ? "bg-foreground text-background"
                : "text-foreground/80 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.06]",
            ].join(" ")}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuAreaRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const onClickOutside = (e: MouseEvent) => {
      const el = menuAreaRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 px-4 py-4 text-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-black/10 bg-background/78 px-3 py-2 shadow-[0_14px_36px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-black/45 dark:shadow-[0_14px_36px_rgba(0,0,0,0.34)]">
        <Link
          href="/"
          className="rounded-full px-3 py-2 text-sm font-semibold tracking-[0.02em] transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
        >
          Yakob
        </Link>

        <nav className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-black/10 bg-black/[0.03] p-1 text-sm dark:border-white/10 dark:bg-white/[0.04] md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-full px-4 py-2 transition",
                    isActive
                      ? "bg-foreground text-background shadow-sm"
                      : "text-foreground/78 hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div
            ref={menuAreaRef}
            className="relative flex items-center rounded-full border border-black/10 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <IconButton href="https://www.linkedin.com/in/ygetu/" label="LinkedIn">
              <LinkedInIcon className="h-4 w-4" />
            </IconButton>
            <IconButton href="https://github.com/ygetu22" label="GitHub">
              <GitHubIcon className="h-4 w-4" />
            </IconButton>
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-black/[0.06] hover:text-foreground dark:hover:bg-white/[0.08] md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MenuIcon className="h-4 w-4" />
            </button>

            {menuOpen ? (
              <div
                id="mobile-menu"
                className="absolute right-0 top-full z-50 mt-3 w-56 max-w-[calc(100vw-2rem)] md:hidden"
              >
                <div className="overflow-hidden rounded-3xl border border-black/10 bg-background/95 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-black/85 dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                  <MobileMenu pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                </div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}

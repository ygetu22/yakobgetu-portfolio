"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-black/20 px-3 py-1 text-sm dark:border-white/20"
      aria-label="Toggle theme"
    >
      <span suppressHydrationWarning>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-semibold">
          Yakob
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/posts" className="hover:underline">
            Posts
          </Link>
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <Link href="/hobbies" className="hover:underline">
            Hobbies
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

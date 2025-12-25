"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border px-3 py-1 text-sm"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 text-black backdrop-blur dark:bg-black/90 dark:text-white">
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

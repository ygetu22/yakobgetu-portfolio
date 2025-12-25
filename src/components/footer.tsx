"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "America/New_York",
  }).format(new Date());

  const now = new Date();
  const isChristmas = now.getMonth() === 11 && now.getDate() === 25;

  const parts = [
    `Yakob Getu © ${year}`,
    `it’s ${weekday}`,
    isChristmas ? "Merry Christmas!" : null,
  ].filter(Boolean);

  return (
    <footer className="w-full py-10 text-center text-sm">
      <div className="mx-auto max-w-5xl px-4">
        <span>{parts.join(" · ")}</span>
        <span>{" · "}</span>
        <Link href="/contact" className="hover:underline">
          contact
        </Link>
      </div>
    </footer>
  );
}

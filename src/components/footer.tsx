"use client";

import Link from "next/link";

function formatFooterDate(d: Date) {
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(d);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d);
  const fullDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);

  return { year, weekday, fullDate };
}

export default function Footer() {
  const d = new Date();
  const { year, weekday, fullDate } = formatFooterDate(d);

  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4">
        <p className="text-xs opacity-70" suppressHydrationWarning>
          Yakob Getu © {year} · {weekday} · {fullDate} ·{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact
          </Link>
        </p>
      </div>
    </footer>
  );
}

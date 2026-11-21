"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Learn from "@/components/culture/learn";
import { tibebBand } from "@/components/culture/tibeb";
import Reveal from "@/components/motion/reveal";
import WeightLetters from "@/components/motion/weight-letters";
import { useIsInBrowser } from "@/components/ui/use-is-in-browser";
import styles from "./site-footer.module.css";

const bandStyle = {
  "--tibeb-image": tibebBand.url,
  "--tibeb-height": `${tibebBand.height}px`,
} as CSSProperties;

const COLUMBUS_TIME_ZONE = "America/New_York";

// Today's month and year in the Western calendar, for Columbus.
function columbusDate(now: Date): string {
  return now.toLocaleDateString("en-US", { timeZone: COLUMBUS_TIME_ZONE, month: "long", year: "numeric" });
}

function clockTime(now: Date, timeZone?: string): string {
  return now.toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
}

// The visitor's own time, or null when they are in Columbus's time zone anyway.
function visitorTime(now: Date): string | null {
  const theirs = clockTime(now);
  return theirs === clockTime(now, COLUMBUS_TIME_ZONE) ? null : theirs;
}

// The current minute, refreshed every 20 seconds so the clocks stay right.
function useNow(isInBrowser: boolean): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    if (!isInBrowser) return;
    const tick = () => setNow(new Date());
    const timer = window.setInterval(tick, 20_000);
    const first = window.setTimeout(tick, 0);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(first);
    };
  }, [isInBrowser]);
  return now;
}

// The same day in the Ethiopian calendar, written in Amharic. Null if the browser lacks that calendar.
function ethiopianDate(): string | null {
  try {
    const parts = new Intl.DateTimeFormat("am-ET-u-ca-ethiopic-nu-latn", {
      timeZone: "Africa/Addis_Ababa",
      month: "long",
      year: "numeric",
    }).formatToParts(new Date());
    const month = parts.find((part) => part.type === "month")?.value;
    const year = parts.find((part) => part.type === "year")?.value;
    return month && year ? `${month} ${year} ዓ.ም` : null;
  } catch {
    return null;
  }
}

export default function SiteFooter() {
  // Dates depend on the visitor's clock, so they are filled in once the page runs in the browser.
  const isInBrowser = useIsInBrowser();
  const now = useNow(isInBrowser);
  const amharicDate = isInBrowser ? ethiopianDate() : null;
  const theirTime = now ? visitorTime(now) : null;

  return (
    <footer className={styles.footer}>
      <Reveal className={styles.bandReveal}>
        <Learn lesson="tibeb" as="div" className={styles.band} label="A woven tibeb band in green, gold and red">
          <span className={styles.weave} style={bandStyle} />
        </Learn>
      </Reveal>

      <div className={styles.meta}>
        {now && (
          <p>
            <span className="muted">Columbus</span> {clockTime(now, COLUMBUS_TIME_ZONE)} · {columbusDate(now)}
            {theirTime && <span className="muted"> · {theirTime} where you are</span>}
          </p>
        )}
        {amharicDate && (
          <Learn lesson="calendar" as="p">
            <span className="muted" lang="am">
              ኢትዮጵያ
            </span>{" "}
            <span lang="am">{amharicDate}</span>
            <span className="sr-only"> (today in the Ethiopian calendar)</span>
          </Learn>
        )}
      </div>

      {/* A large signature that closes the page. The name is already in the header, so this one is decorative. */}
      <p className={`display-heading ${styles.signature}`} aria-hidden="true">
        <WeightLetters text="Yakob Getu" restingWeight={200} />
      </p>
    </footer>
  );
}

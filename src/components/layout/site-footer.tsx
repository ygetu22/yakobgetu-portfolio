"use client";

import type { CSSProperties } from "react";
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

// Today's month and year in the Western calendar, for Columbus.
function columbusDate(): string {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "long",
    year: "numeric",
  });
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
  const westernDate = isInBrowser ? columbusDate() : null;
  const amharicDate = isInBrowser ? ethiopianDate() : null;

  return (
    <footer className={styles.footer}>
      <Reveal className={styles.bandReveal}>
        <Learn lesson="tibeb" as="div" className={styles.band} label="A woven tibeb band in green, gold and red">
          <span className={styles.weave} style={bandStyle} />
        </Learn>
      </Reveal>

      <div className={styles.meta}>
        <p>
          <span className="muted">Columbus</span> {westernDate}
        </p>
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

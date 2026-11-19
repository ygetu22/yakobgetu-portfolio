"use client";

import { useRef, useState, type CSSProperties } from "react";
import Learn from "@/components/culture/learn";
import { tibebBand } from "@/components/culture/tibeb";
import { SiteLink } from "@/components/layout/page-curtain";
import { clamp } from "@/components/motion/motion-math";
import ReadAlong from "@/components/motion/read-along";
import Reveal from "@/components/motion/reveal";
import { prefersReducedMotion, useScrollFrame } from "@/components/motion/scroll-frame";
import WeightLetters from "@/components/motion/weight-letters";
import ProjectSteps from "../project-steps";
import { closingQuote, journalChapters, journalPhotos, type JournalQuote } from "./journal-data";
import { placeChapters } from "./journal-layout";
import JournalShot from "./journal-shot";
import PhotoViewer from "./photo-viewer";
import { useReactions } from "./use-reactions";
import styles from "./journal.module.css";

const placedChapters = placeChapters(journalChapters);

const bandStyle = {
  "--tibeb-image": tibebBand.url,
  "--tibeb-height": `${tibebBand.height}px`,
} as CSSProperties;

function Quote({ quote, isOnRight }: { quote: JournalQuote; isOnRight: boolean }) {
  return (
    <Reveal className={`${styles.quote} ${isOnRight ? styles.right : ""}`}>
      <blockquote>
        <p className={`display-heading ${styles.quoteOriginal}`} lang={quote.lang}>
          {quote.original}
        </p>
        {quote.english && <ReadAlong text={quote.english} className={styles.quoteEnglish} />}
        <footer>{quote.source}</footer>
      </blockquote>
    </Reveal>
  );
}

// The whole Elsewhere page: a heading, an index of chapters that follows along,
// each chapter's photos in the order they were taken, and a viewer for looking closer.
export default function PhotoJournal() {
  const reactions = useReactions();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState(journalChapters[0].id);
  const entriesRef = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const entries = entriesRef.current;
    if (!entries) return;
    const viewportHeight = window.innerHeight;

    // The chapter whose heading most recently passed the middle of the screen is the current one.
    let currentId = journalChapters[0].id;
    for (const chapter of journalChapters) {
      const heading = document.getElementById(`chapter-${chapter.id}`);
      if (heading && heading.getBoundingClientRect().top < viewportHeight * 0.55) currentId = chapter.id;
    }
    setCurrentChapterId(currentId);

    // Each picture moves a little slower than the page (--shift is used in journal.module.css).
    if (prefersReducedMotion()) return;
    for (const frame of entries.querySelectorAll<HTMLElement>("[data-shot-frame]")) {
      const box = frame.getBoundingClientRect();
      const isOnScreen = box.bottom > 0 && box.top < viewportHeight;
      if (!isOnScreen) continue;
      const fromCenter = clamp((box.top + box.height / 2 - viewportHeight / 2) / viewportHeight, -1, 1);
      frame.style.setProperty("--shift", `${(-fromCenter * box.height * 0.04).toFixed(1)}px`);
    }
  });

  const firstDate = journalPhotos[0].date;
  const lastDate = journalPhotos[journalPhotos.length - 1].date;

  return (
    <>
      <section className={`section page-top ${styles.head}`} aria-labelledby="journal-title">
        <ProjectSteps projectId="elsewhere" back={{ href: "/#life", label: "Back to Life", curtainTitle: "Life" }} />
        <h1 id="journal-title" className="display-heading page-title">
          <WeightLetters text="Elsewhere" restingWeight={300} decodeOnMount />
        </h1>
        <p className={styles.subtitle}>
          <Learn lesson="tizita">
            <span lang="am">ትዝታ</span>
            <span className="sr-only"> (tizita)</span>
          </Learn>
          <span className="eyebrow">· Tizita · A photo journal</span>
        </p>
        <p className={styles.intro}>
          Places I&apos;ve been and things I noticed there, in the order they happened. I take most of
          these on a small Fujifilm camera.
        </p>
        <p className={`muted ${styles.count}`}>
          {journalPhotos.length} photos · {journalChapters.length} chapters · {firstDate} – {lastDate}
        </p>
        <Reveal className={styles.bandReveal}>
          <Learn lesson="tibeb" as="div" label="A woven tibeb band in green, gold and red">
            <span className={styles.weave} style={bandStyle} />
          </Learn>
        </Reveal>
      </section>

      <section className={`section ${styles.body}`} aria-label="The journal">
        <nav className={styles.index} aria-label="Chapters in this journal">
          <ol>
            {journalChapters.map((chapter, index) => (
              <li key={chapter.id}>
                <a
                  href={`#chapter-${chapter.id}`}
                  className={chapter.id === currentChapterId ? styles.currentChapter : undefined}
                  aria-current={chapter.id === currentChapterId ? "location" : undefined}
                >
                  <span className={styles.indexNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{chapter.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div ref={entriesRef} className={styles.entries}>
          {placedChapters.map(({ chapter, photos, isQuoteOnRight }) => (
            <section key={chapter.id} className={styles.chapter} aria-labelledby={`chapter-${chapter.id}`}>
              <Reveal>
                <header className={styles.chapterHead}>
                  <h2 id={`chapter-${chapter.id}`} className="display-heading">
                    <WeightLetters text={chapter.title} restingWeight={300} />
                  </h2>
                  <p className="muted">
                    {chapter.when} · {photos.length} {photos.length === 1 ? "photo" : "photos"}
                  </p>
                </header>
              </Reveal>

              {photos.map(({ photo, number, isOnRight }) => (
                <JournalShot
                  key={photo.id}
                  photo={photo}
                  number={number}
                  isOnRight={isOnRight}
                  isInViewer={viewerIndex === number - 1}
                  reactions={reactions}
                  onOpen={() => setViewerIndex(number - 1)}
                />
              ))}

              {chapter.quote && <Quote quote={chapter.quote} isOnRight={isQuoteOnRight} />}
            </section>
          ))}
        </div>
      </section>

      <section className={`section ${styles.end}`} aria-label="End of the journal">
        <Quote quote={closingQuote} isOnRight={false} />
        <Reveal>
          <p className={`display-heading ${styles.endLine}`}>
            That&apos;s it for now. <span className="muted">More on the way.</span>
          </p>
        </Reveal>
        <SiteLink href="/#life" curtainTitle="Life" className="back-link">
          <span aria-hidden="true">←</span> Back to Life
        </SiteLink>
      </section>

      <PhotoViewer
        photos={journalPhotos}
        openIndex={viewerIndex}
        onChange={setViewerIndex}
        onClose={() => setViewerIndex(null)}
      />
    </>
  );
}

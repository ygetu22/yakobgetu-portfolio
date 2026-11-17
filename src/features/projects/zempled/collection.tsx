"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SiteLink } from "@/components/layout/page-curtain";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import { profileFor } from "./artists";
import { groupByOriginalArtist, randomOtherIndex, wrapIndex } from "./pair-order";
import PlatformLinks from "./platform-links";
import { samplePairs, type SamplePair } from "./sample-pairs";
import { usePreviewPlayer } from "./use-preview-player";
import styles from "./collection.module.css";

const SIDE_LABELS = ["Original", "Sample"];

function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={back ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  );
}

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {playing ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="m8 4 13 8-13 8z" />}
    </svg>
  );
}

type PairDeckProps = {
  pair: SamplePair;
  // The first pair is on screen when the page loads, so its covers load first.
  isFirstPair: boolean;
};

// The two records of one pair with their preview players.
// Rendered with key={pair.id}, so changing pair starts with fresh players and stops the old ones.
function PairDeck({ pair, isFirstPair }: PairDeckProps) {
  const tracks = [pair.original, pair.sampled] as const;
  const player = usePreviewPlayer(tracks);
  const [openInApp, setOpenInApp] = useState(true);

  return (
    <>
      <div className={styles.records}>
        {tracks.map((track, side) => {
          const isPlaying = player.playingSide === side;
          const isLoading = player.loadingSide === side;

          return (
            <article className={styles.record} key={track.id} aria-label={`${SIDE_LABELS[side]}: ${track.title}`}>
              <div className={styles.cover}>
                <Image
                  src={track.cover}
                  alt={`Cover of ${track.album} by ${track.artist}`}
                  width={500}
                  height={500}
                  priority={isFirstPair}
                  sizes="(max-width: 600px) 42vw, 360px"
                />
              </div>

              <div className={styles.trackInfo}>
                <p className={styles.side}>{SIDE_LABELS[side]}</p>
                <h2>{track.title}</h2>
                <p>{track.artist}</p>
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.play}
                  onClick={() => player.toggle(side)}
                  aria-label={`${isPlaying ? "Pause" : "Play"} 30-second preview of ${track.title}`}
                  aria-busy={isLoading}
                >
                  {isLoading ? <span className={styles.spinner} /> : <PlayIcon playing={isPlaying} />}
                </button>
                <PlatformLinks track={track} openInApp={openInApp} onOpen={player.pauseAll} />
              </div>

              <div className={styles.timeline}>
                <input
                  type="range"
                  min="0"
                  max={player.PREVIEW_SECONDS}
                  step="0.1"
                  value={player.elapsed[side]}
                  aria-label={`Seek ${track.title} preview`}
                  onChange={(event) => player.seek(side, Number(event.target.value))}
                />
              </div>

              <audio {...player.audioProps(side)} />
            </article>
          );
        })}
      </div>

      <p className={styles.listeningHint}>30-second previews. Icons open the full song.</p>
      <div className={styles.linkDestination} role="group" aria-label="Where to open Spotify and Apple Music">
        <span>Spotify &amp; Apple Music</span>
        <button type="button" aria-pressed={openInApp} onClick={() => setOpenInApp(true)}>
          App
        </button>
        <button type="button" aria-pressed={!openInApp} onClick={() => setOpenInApp(false)}>
          Browser
        </button>
      </div>
      <p className={styles.appHint}>
        {openInApp ? "App not installed? Choose Browser." : "Signed in only in the app? Choose App."}
      </p>

      {player.error && (
        <p role="alert" className={styles.error}>
          {player.error}
        </p>
      )}
    </>
  );
}

function PairNotes({ pair }: { pair: SamplePair }) {
  const artist = profileFor(pair.original.artist);

  return (
    <div className={styles.notes}>
      <details>
        <summary>
          Behind the sample <span aria-hidden="true">+</span>
        </summary>
        <p>{pair.note}</p>
        <a href={pair.source.url} target="_blank" rel="noopener noreferrer">
          Source: {pair.source.label} <span className="sr-only">(new tab)</span>
        </a>
      </details>

      {artist && (
        <details>
          <summary>
            About {artist.name} <span aria-hidden="true">+</span>
          </summary>
          <p>
            <span className={styles.artistDetail}>{artist.detail}.</span> {artist.bio}
          </p>
          <a href={artist.source.url} target="_blank" rel="noopener noreferrer">
            Learn more: {artist.source.label} <span className="sr-only">(new tab)</span>
          </a>
        </details>
      )}
    </div>
  );
}

const artistGroups = groupByOriginalArtist(samplePairs, (credit) => profileFor(credit)?.name ?? credit);

export default function Zempled() {
  const [index, setIndex] = useState(0);
  const collection = useRef<HTMLElement>(null);
  const pair = samplePairs[index];
  const total = samplePairs.length;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Arrow keys already move the sliders and the caret in fields; leave those alone.
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowLeft") setIndex((current) => wrapIndex(current - 1, total));
      if (event.key === "ArrowRight") setIndex((current) => wrapIndex(current + 1, total));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  function openFromIndex(pairId: string) {
    setIndex(samplePairs.findIndex((entry) => entry.id === pairId));
    collection.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <div>
          <SiteLink href="/projects" curtainTitle="Projects" className="back-link">
            <span aria-hidden="true">←</span> All projects
          </SiteLink>
          <h1 className="display-heading">
            Zem<span>pled</span>
            <i>.</i>
          </h1>
          <p>Ethiopian originals. New echoes.</p>
        </div>
        <span className={styles.edition}>
          A listening collection{" "}
          <span lang="am" title="Tizita: memory, nostalgia">
            ትዝታ
          </span>
        </span>
      </header>

      <section ref={collection} aria-label="Original and sampled recordings" className={styles.collection}>
        <div className={styles.counter}>
          <span>ORIGINAL → SAMPLE</span>
          <span aria-live="polite">
            <span className="sr-only">Pair </span>
            {String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span>
            <span className="sr-only"> of </span> {total}
          </span>
        </div>

        <div className={styles.deck}>
          <button
            type="button"
            className={`${styles.arrow} ${styles.previous}`}
            onClick={() => setIndex(wrapIndex(index - 1, total))}
            aria-label="Previous sample pair"
          >
            <ArrowIcon back />
          </button>
          <PairDeck key={pair.id} pair={pair} isFirstPair={index === 0} />
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => setIndex(wrapIndex(index + 1, total))}
            aria-label="Next sample pair"
          >
            <ArrowIcon />
          </button>
        </div>

        <div className={styles.bottom}>
          <PairNotes key={pair.id} pair={pair} />
          <button
            type="button"
            className={styles.shuffle}
            onClick={() => setIndex(randomOtherIndex(index, total, Math.random()))}
          >
            Shuffle
          </button>
        </div>
      </section>

      <section className={styles.index} aria-labelledby="zempled-index-title">
        <h2 id="zempled-index-title">All {total} pairs</h2>
        <p className={styles.indexHint}>Grouped by the Ethiopian artist who was sampled.</p>

        {artistGroups.map((group) => (
          <div className={styles.group} key={group.artist}>
            <h3>{group.artist}</h3>
            <ul>
              {group.pairs.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => openFromIndex(entry.id)}
                    aria-current={entry.id === pair.id ? "true" : undefined}
                  >
                    <span>{entry.original.title}</span>
                    <span aria-hidden="true">→</span>
                    <span className="sr-only">sampled in</span>
                    <span>
                      {entry.sampled.title}
                      <small>{entry.sampled.artist}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

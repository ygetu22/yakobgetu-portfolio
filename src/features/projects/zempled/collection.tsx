"use client";

import ActionLinkLabel from "@/components/ui/action-link-label";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { samplePairs } from "./sample-pairs";
import PlatformLinks from "./platform-links";
import styles from "./collection.module.css";

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={back ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} /></svg>;
}

export default function Zempled() {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState([0, 0]);
  const [error, setError] = useState<string | null>(null);
  const [openInApp, setOpenInApp] = useState(true);
  const audios = useRef<(HTMLAudioElement | null)[]>([null, null]);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const pair = samplePairs[index];
  const tracks = [pair.original, pair.sampled];

  useEffect(() => {
    const players = [...audios.current];
    const cancelPending = () => {
      generation.current++;
      request.current?.abort();
    };
    return () => {
      cancelPending();
      players.forEach(audio => audio?.pause());
    };
  }, [index]);

  function pausePreviews() {
    generation.current++;
    request.current?.abort();
    audios.current.forEach(audio => audio?.pause());
    setActive(null);
    setLoading(null);
    setError(null);
  }

  function change(next: number) {
    generation.current++;
    request.current?.abort();
    audios.current.forEach(audio => { if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); } });
    setActive(null); setLoading(null); setElapsed([0, 0]); setError(null);
    setIndex((next + samplePairs.length) % samplePairs.length);
  }

  async function toggle(side: number) {
    const audio = audios.current[side];
    if (!audio) return;
    const version = ++generation.current;
    request.current?.abort();
    setLoading(null); setError(null);
    audios.current.forEach((other, i) => { if (i !== side) other?.pause(); });
    if (!audio.paused) { audio.pause(); setActive(null); return; }
    setActive(null);
    try {
      if (!audio.getAttribute("src")) {
        const controller = new AbortController();
        request.current = controller;
        setLoading(side);
        const response = await fetch(`/api/zempled/preview?track=${tracks[side].id}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unavailable");
        const data = await response.json();
        if (version !== generation.current) return;
        audio.src = data.preview;
      }
      if (audio.currentTime >= 29.8 || audio.ended) audio.currentTime = 0;
      await audio.play();
      if (version !== generation.current) { audio.pause(); return; }
      setActive(side);
    } catch (cause) {
      if (version !== generation.current || (cause instanceof Error && cause.name === "AbortError")) return;
      setError(`Preview unavailable for “${tracks[side].title}”. Try a listening link.`);
    } finally { if (version === generation.current) setLoading(null); }
  }

  return <main className={styles.page}>
    <header className={styles.heading}>
      <div><Link href="/projects" className={styles.back}><ActionLinkLabel direction="back">All projects</ActionLinkLabel></Link><h1 className="display-heading">Zem<span>pled</span><i>.</i></h1><p>Ethiopian originals. New echoes.</p></div>
      <span className={styles.edition}>A listening collection <span lang="am">ትዝታ</span></span>
    </header>
    <section aria-label="Original and sampled recordings" className={styles.collection}>
      <div className={styles.counter}><span>ORIGINAL → SAMPLE</span></div>
      <div className={styles.deck}>
        <button className={`${styles.arrow} ${styles.previous}`} onClick={() => change(index - 1)} aria-label="Previous sample pair"><Arrow back /></button>
        <div className={styles.records} key={pair.id}>
          {tracks.map((track, side) => <article className={styles.record} key={track.id}>
            <div className={styles.cover}><Image src={track.cover} alt={`${track.album} album cover`} width={500} height={500} priority={index === 0} sizes="(max-width: 600px) 42vw, 360px" /></div>
            <div className={styles.trackInfo}><h2>{track.title}</h2><p>{track.artist}</p></div>
            <div className={styles.controls}>
              <button className={styles.play} onClick={() => toggle(side)} aria-label={`${active === side ? "Pause" : "Play"} 30-second preview of ${track.title}`} aria-busy={loading === side}>
                {loading === side ? <span className={styles.spinner} /> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{active === side ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="m8 4 13 8-13 8z" />}</svg>}
              </button><PlatformLinks track={track} openInApp={openInApp} onOpen={pausePreviews} />
            </div>
            <div className={styles.timeline}><input type="range" min="0" max="30" step="0.1" value={elapsed[side]} aria-label={`Seek ${track.title} preview`} onChange={event => {
              const audio = audios.current[side];
              if (audio?.readyState) { const time = Math.min(Number(event.target.value), audio.duration || 30); audio.currentTime = time; setElapsed(values => values.map((value, i) => i === side ? time : value)); }
            }} /></div>
            <audio ref={element => { audios.current[side] = element; }} preload="none" onTimeUpdate={event => {
              const audio = event.currentTarget;
              if (audio.currentTime >= 30) { audio.pause(); setActive(current => current === side ? null : current); }
              setElapsed(values => values.map((value, i) => i === side ? Math.min(audio.currentTime, 30) : value));
            }} onEnded={() => setActive(current => current === side ? null : current)} onError={() => { if (audios.current[side]?.getAttribute("src")) { setActive(current => current === side ? null : current); setError(`Preview unavailable for “${track.title}”. Try a listening link.`); audios.current[side]?.removeAttribute("src"); } }} />
          </article>)}
        </div>
        <button className={`${styles.arrow} ${styles.next}`} onClick={() => change(index + 1)} aria-label="Next sample pair"><Arrow /></button>
      </div>
      <p className={styles.listeningHint}>30-second previews. Icons open the full song.</p>
      <div className={styles.linkDestination} role="group" aria-label="Where to open Spotify and Apple Music">
        <span>Spotify &amp; Apple Music</span>
        <button type="button" aria-pressed={openInApp} onClick={() => setOpenInApp(true)}>App</button>
        <button type="button" aria-pressed={!openInApp} onClick={() => setOpenInApp(false)}>Browser</button>
      </div>
      <p className={styles.appHint}>
        {openInApp ? "App not installed? Choose Browser." : "Signed in only in the app? Choose App."}
      </p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.bottom}>
        <details key={pair.id} className={styles.notes}><summary>Behind the sample <span>+</span></summary><p>{pair.note}</p><a href={pair.source.url} target="_blank" rel="noopener noreferrer"><ActionLinkLabel>{pair.source.label}</ActionLinkLabel></a></details>
        <div className={styles.dots} aria-label="Choose a sample pair">{samplePairs.map((item, i) => <button key={item.id} aria-label={`Pair ${i + 1}: ${item.original.artist} and ${item.sampled.artist}`} aria-current={i === index ? "true" : undefined} onClick={() => change(i)}><span /></button>)}</div>
      </div>
    </section>
  </main>;
}

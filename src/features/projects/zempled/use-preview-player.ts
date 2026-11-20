"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "./sample-pairs";

const PREVIEW_SECONDS = 30;

// Plays the 30-second previews of one pair: the original on side 0, the sample on side 1.
// Only one side plays at a time. A preview's address is fetched the first time it is played.
// The component using this hook is re-created for each pair, which stops anything still playing.
export function usePreviewPlayer(tracks: readonly [Track, Track]) {
  const audioElements = useRef<(HTMLAudioElement | null)[]>([null, null]);
  const pendingRequest = useRef<AbortController | null>(null);
  // Counts user actions. A slow response that belongs to an older action is ignored.
  const actionCount = useRef(0);

  const [playingSide, setPlayingSide] = useState<number | null>(null);
  const [loadingSide, setLoadingSide] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState([0, 0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const players = audioElements.current;
    return () => {
      pendingRequest.current?.abort();
      players.forEach((audio) => audio?.pause());
    };
  }, []);

  function setElapsedFor(side: number, seconds: number) {
    setElapsed((values) => values.map((value, index) => (index === side ? seconds : value)));
  }

  function unavailableMessage(side: number) {
    return `Preview unavailable for “${tracks[side].title}”. Try a listening link.`;
  }

  // Stops both previews, for example when the visitor opens the song in another app.
  function pauseAll() {
    actionCount.current += 1;
    pendingRequest.current?.abort();
    audioElements.current.forEach((audio) => audio?.pause());
    setPlayingSide(null);
    setLoadingSide(null);
    setError(null);
  }

  async function toggle(side: number) {
    const audio = audioElements.current[side];
    if (!audio) return;

    const wasPlaying = !audio.paused;
    pauseAll();
    if (wasPlaying) return;

    const thisAction = actionCount.current;
    const isStale = () => thisAction !== actionCount.current;

    try {
      if (!audio.getAttribute("src")) {
        const request = new AbortController();
        pendingRequest.current = request;
        setLoadingSide(side);
        const response = await fetch(`/api/zempled/preview?track=${tracks[side].id}`, { signal: request.signal });
        if (!response.ok) throw new Error("Preview unavailable");
        const data: { preview: string } = await response.json();
        if (isStale()) return;
        audio.src = data.preview;
      }

      if (audio.ended || audio.currentTime >= PREVIEW_SECONDS - 0.2) audio.currentTime = 0;
      await audio.play();
      if (isStale()) {
        audio.pause();
        return;
      }
      setPlayingSide(side);
    } catch (cause) {
      const wasCancelled = cause instanceof Error && cause.name === "AbortError";
      if (!isStale() && !wasCancelled) setError(unavailableMessage(side));
    } finally {
      if (!isStale()) setLoadingSide(null);
    }
  }

  function seek(side: number, seconds: number) {
    const audio = audioElements.current[side];
    // Nothing to seek in until the preview has started loading.
    if (!audio?.readyState) return;
    const time = Math.min(seconds, audio.duration || PREVIEW_SECONDS);
    audio.currentTime = time;
    setElapsedFor(side, time);
  }

  // Props for the <audio> element of one side.
  function audioProps(side: number) {
    return {
      ref: (element: HTMLAudioElement | null) => {
        audioElements.current[side] = element;
      },
      preload: "none" as const,
      onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement>) => {
        setElapsedFor(side, Math.min(event.currentTarget.currentTime, PREVIEW_SECONDS));
      },
      onEnded: () => setPlayingSide((current) => (current === side ? null : current)),
      onError: (event: React.SyntheticEvent<HTMLAudioElement>) => {
        // An element with no address yet also reports an error; only a failed preview matters.
        if (!event.currentTarget.getAttribute("src")) return;
        event.currentTarget.removeAttribute("src");
        setPlayingSide((current) => (current === side ? null : current));
        setError(unavailableMessage(side));
      },
    };
  }

  return { playingSide, loadingSide, elapsed, error, toggle, seek, pauseAll, audioProps, PREVIEW_SECONDS };
}

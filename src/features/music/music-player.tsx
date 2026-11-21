"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { showToast } from "@/components/ui/toast";
import { playlistTracks, type PlaylistTrack } from "./playlist-tracks";
import { createShuffleQueue, type ShuffleQueue } from "./shuffle-queue";

// Background music: shuffles 30-second clips of the songs in Yakob's Spotify playlist "ethio".
//
// It plays Spotify's own preview clips through one plain <audio> element instead of Spotify's
// embedded player. That keeps third-party scripts and frames off the site, works the same for
// every visitor (no Spotify login), and lets the site draw its own controls. The provider sits
// in the root layout, so the music keeps playing while the visitor moves between pages.
// Nothing is requested from Spotify until the visitor turns the music on.

// Give up after this many songs in a row fail to load, instead of skipping forever.
const MAX_FAILED_IN_A_ROW = 4;
const VOLUME = 0.7;

type MusicPlayer = {
  // On means the visitor asked for music; it can still be paused.
  isOn: boolean;
  isPaused: boolean;
  track: PlaylistTrack | null;
  positionSeconds: number;
  durationSeconds: number;
  toggle: () => void;
  togglePause: () => void;
  playNext: () => void;
  seek: (seconds: number) => void;
};

const MusicContext = createContext<MusicPlayer | null>(null);

export function useMusicPlayer(): MusicPlayer {
  const player = useContext(MusicContext);
  if (!player) throw new Error("useMusicPlayer must be used inside <MusicPlayerProvider>.");
  return player;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const queue = useRef<ShuffleQueue<PlaylistTrack> | null>(null);
  const failedInARow = useRef(0);

  const [isOn, setIsOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [track, setTrack] = useState<PlaylistTrack | null>(null);
  const [positionSeconds, setPositionSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  function play(audio: HTMLAudioElement) {
    // play() is refused if the browser decides this was not started by the visitor.
    audio.play().catch(() => setIsPaused(true));
  }

  function playNext() {
    const audio = audioRef.current;
    if (!audio) return;

    queue.current ??= createShuffleQueue(playlistTracks);
    const nextTrack = queue.current.next();
    setTrack(nextTrack);
    setPositionSeconds(0);
    setDurationSeconds(0);
    setIsPaused(false);
    audio.src = nextTrack.previewUrl;
    audio.volume = VOLUME;
    play(audio);
  }

  function turnOff() {
    audioRef.current?.pause();
    setIsOn(false);
    setIsPaused(false);
  }

  function toggle() {
    if (isOn) {
      turnOff();
      return;
    }
    failedInARow.current = 0;
    setIsOn(true);

    // Turning the music back on carries on with the song it stopped on, instead of a new one.
    const audio = audioRef.current;
    if (audio && track && audio.src && !audio.ended) {
      setIsPaused(false);
      play(audio);
      return;
    }
    playNext();
  }

  function togglePause() {
    const audio = audioRef.current;
    if (!audio || !isOn) return;

    if (audio.paused) {
      setIsPaused(false);
      play(audio);
    } else {
      audio.pause();
      setIsPaused(true);
    }
  }

  function seek(seconds: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(0, seconds), audio.duration);
    setPositionSeconds(audio.currentTime);
  }

  function handleError() {
    if (!isOn) return;
    failedInARow.current += 1;
    if (failedInARow.current >= MAX_FAILED_IN_A_ROW) {
      turnOff();
      showToast("Couldn't load the music right now");
      return;
    }
    playNext();
  }

  const player: MusicPlayer = {
    isOn,
    isPaused,
    track,
    positionSeconds,
    durationSeconds,
    toggle,
    togglePause,
    playNext,
    seek,
  };

  return (
    <MusicContext.Provider value={player}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => {
          failedInARow.current = 0;
        }}
        onTimeUpdate={(event) => setPositionSeconds(event.currentTarget.currentTime)}
        onDurationChange={(event) => {
          const { duration } = event.currentTarget;
          setDurationSeconds(Number.isFinite(duration) ? duration : 0);
        }}
        onEnded={() => {
          if (isOn) playNext();
        }}
        onError={handleError}
      />
    </MusicContext.Provider>
  );
}

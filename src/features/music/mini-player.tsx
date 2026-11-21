"use client";

import { artistPhoto } from "./artists";
import { useMusicPlayer } from "./music-player";
import styles from "./mini-player.module.css";

// Phones only: while the music is on, a small "now playing" bar sits above the bottom buttons,
// like the mini player in Apple Music. Tapping it opens the full player.
export default function MiniPlayer({ onOpen }: { onOpen: () => void }) {
  const music = useMusicPlayer();
  const { track } = music;
  if (!music.isOn || !track) return null;

  const photo = artistPhoto(track.artist);
  const progress = music.durationSeconds ? music.positionSeconds / music.durationSeconds : 0;

  return (
    <div className={styles.mini}>
      <button type="button" className={styles.open} onClick={onOpen}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- a 40 px thumbnail; next/image adds nothing here
          <img className={styles.art} src={photo} alt="" />
        ) : (
          <span className={styles.art} aria-hidden="true" />
        )}
        <span className={styles.text}>
          <span className={styles.title}>{track.title}</span>
          <span className={styles.artist}>{track.artist}</span>
        </span>
        <span className="sr-only">, open the music player</span>
      </button>
      <button
        type="button"
        className={styles.pause}
        onClick={music.togglePause}
        aria-label={music.isPaused ? "Resume the music" : "Pause the music"}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {music.isPaused ? <path d="m8 4 13 8-13 8z" /> : <path d="M6 4h4v16H6zm8 0h4v16h-4z" />}
        </svg>
      </button>
      <span className={styles.progress} style={{ scale: `${progress} 1` }} aria-hidden="true" />
    </div>
  );
}

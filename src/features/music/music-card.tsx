"use client";

import { artistPhoto, artistWikipediaUrl, songMeaning } from "./artists";
import { useMusicPlayer } from "./music-player";
import { PLAYLIST_URL } from "./playlist-tracks";
import styles from "./music-card.module.css";

function formatTime(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// What the visitor sees in the card next to the music button: what the playlist is,
// and, once the music is on, the current song with pause, skip and a seek slider.
// `onStop` lets the phone sheet close itself once the music is stopped.
export default function MusicCard({ onStop }: { onStop?: () => void }) {
  const music = useMusicPlayer();
  const { track } = music;
  const photo = track ? artistPhoto(track.artist) : null;
  const artistPage = track ? artistWikipediaUrl(track.artist) : null;
  const meaning = track ? songMeaning(track.title) : null;

  return (
    <div className={styles.card}>
      <p className={`display-heading ${styles.title}`}>ethio</p>
      <p className={styles.about}>My Ethiopian playlist on Spotify. Aster Aweke, Teddy Afro, Gigi and more.</p>

      {music.isOn && track ? (
        <div className={styles.player}>
          {/* key: the photo fades in again for each new song. */}
          <div className={styles.story} key={track.id}>
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element -- a small faded backdrop; next/image adds nothing here
              <img className={styles.photo} src={photo} alt="" />
            )}
            <p className={styles.song} aria-live="polite">
              <span className={styles.songTitle}>{track.title}</span>
              <span className="muted">{track.artist}</span>
            </p>
            {meaning && <p className={styles.storyText}>{meaning}</p>}
            {artistPage && (
              <a className={styles.source} href={artistPage} target="_blank" rel="noreferrer">
                About the artist: Wikipedia
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.control}
              onClick={music.togglePause}
              aria-label={music.isPaused ? "Resume the music" : "Pause the music"}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {music.isPaused ? <path d="m8 4 13 8-13 8z" /> : <path d="M6 4h4v16H6zm8 0h4v16h-4z" />}
              </svg>
            </button>
            <button type="button" className={styles.control} onClick={music.playNext} aria-label="Next song">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="m4 4 11 8-11 8zm13 0h3v16h-3z" />
              </svg>
            </button>
            <input
              type="range"
              className={styles.slider}
              min={0}
              max={music.durationSeconds || 30}
              step={0.1}
              value={music.positionSeconds}
              onChange={(event) => music.seek(Number(event.target.value))}
              aria-label={`Position in ${track.title}`}
              aria-valuetext={`${formatTime(music.positionSeconds)} of ${formatTime(music.durationSeconds)}`}
            />
            <span className={styles.time} aria-hidden="true">
              {formatTime(music.positionSeconds)}
            </span>
          </div>

          <p className={styles.links}>
            <a
              className="text-link"
              href={`https://open.spotify.com/track/${track.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Full song on Spotify<span className="sr-only"> (opens in a new tab)</span>
              <span aria-hidden="true"> ↗</span>
            </a>
            <a className="text-link" href={PLAYLIST_URL} target="_blank" rel="noreferrer">
              The playlist<span className="sr-only"> on Spotify (opens in a new tab)</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
          <p className={`muted ${styles.note}`}>
            30-second clips, shuffled.<span className={styles.desktopOnly}> Click the note again to stop.</span>
          </p>
          {/* Phones only: there the note button opens this player instead of stopping the music. */}
          <button
            type="button"
            className={styles.stop}
            onClick={() => {
              music.toggle();
              onStop?.();
            }}
          >
            Stop the music
          </button>
        </div>
      ) : (
        <p className={`muted ${styles.note}`}>Click the note to play 30-second clips, shuffled.</p>
      )}
    </div>
  );
}

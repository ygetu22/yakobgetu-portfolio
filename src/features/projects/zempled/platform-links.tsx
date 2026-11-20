import type { Track } from "./sample-pairs";
import styles from "./collection.module.css";

type PlatformLinksProps = {
  track: Track;
  // Open Spotify and Apple Music in their apps instead of the browser.
  openInApp: boolean;
  onOpen: () => void;
};

// Icons that open the full song on YouTube, Spotify and Apple Music.
// A service is only shown when this exact recording is known to be there.
export default function PlatformLinks({ track, openInApp, onOpen }: PlatformLinksProps) {
  const spotifyUrl = openInApp
    ? track.spotify?.replace("https://open.spotify.com/track/", "spotify:track:")
    : track.spotify;
  const appleMusicUrl = openInApp ? track.appleMusic?.replace(/^https:/, "musics:") : track.appleMusic;
  const destination = openInApp ? "app" : "website (new tab)";
  const target = openInApp ? undefined : "_blank";

  return (
    <div className={styles.platforms}>
      {track.youtube && (
        <a
          href={track.youtube}
          onClick={onOpen}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${track.title} on YouTube (new tab)`}
          title="Open song on YouTube"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21 7a3 3 0 0 0-2-2c-4-.5-10-.5-14 0a3 3 0 0 0-2 2c-.5 3-.5 7 0 10a3 3 0 0 0 2 2c4 .5 10 .5 14 0a3 3 0 0 0 2-2c.5-3 .5-7 0-10ZM10 16V8l7 4Z" />
          </svg>
        </a>
      )}
      {spotifyUrl && (
        <a
          href={spotifyUrl}
          onClick={onOpen}
          target={target}
          rel="noopener noreferrer"
          aria-label={`Open ${track.title} in Spotify ${destination}`}
          title={`Open song in Spotify ${openInApp ? "app" : "browser"}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <g fill="none" stroke="var(--background)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 9c4-1.5 8-1 12 1M7 12c3-1 7-.7 10 1M8 15c2-.6 5-.4 8 .7" />
            </g>
          </svg>
        </a>
      )}
      {appleMusicUrl && (
        <a
          href={appleMusicUrl}
          onClick={onOpen}
          target={target}
          rel="noopener noreferrer"
          aria-label={`Open ${track.title} in Apple Music ${destination}`}
          title={`Open song in Apple Music ${openInApp ? "app" : "browser"}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 4v12a3 3 0 1 0 2 3V9l8-2v7a3 3 0 1 0 2 3V1Z" />
          </svg>
        </a>
      )}
      <a
        href={track.deezer}
        onClick={onOpen}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${track.title} on Deezer (new tab)`}
        title="Open song on Deezer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 17h3v3H3zm5-4h3v7H8zm5-5h3v12h-3zm5-4h3v16h-3z" />
        </svg>
      </a>
    </div>
  );
}

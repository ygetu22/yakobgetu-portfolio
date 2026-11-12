import type { JournalPhoto } from "./journal-data";

// Instagram-style outline icons, drawn on a 24×24 grid.
const icons = {
  heart: "M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7C19.5 15.9 12 20.5 12 20.5Z",
  share: "M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5L21 3Z",
  bookmark: "M18.5 21 12 16.2 5.5 21V4.5A1.5 1.5 0 0 1 7 3h10a1.5 1.5 0 0 1 1.5 1.5Z",
};

function Icon({ path, filled }: { path: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <path d={path} />
    </svg>
  );
}

// A link that opens the journal straight to one photo.
export function photoLink(photo: JournalPhoto): string {
  const url = new URL("/projects/elsewhere", window.location.origin);
  url.searchParams.set("photo", photo.id);
  return url.href;
}

// Phones get their share sheet. Computers copy the link, which is what people
// expect there (desktop Chrome on a Mac would otherwise open the system share menu).
export async function sharePhoto(photo: JournalPhoto): Promise<"shared" | "copied" | "failed"> {
  const url = photoLink(photo);
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  try {
    if (navigator.share && isTouchDevice) {
      await navigator.share({ title: `${photo.place} · Elsewhere`, url });
      return "shared";
    }
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    // Includes the visitor closing the share sheet without sharing.
    return "failed";
  }
}

type PostActionsProps = {
  photo: JournalPhoto;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onShare: () => void;
};

export default function PostActions({ photo, isLiked, isSaved, onToggleLike, onToggleSave, onShare }: PostActionsProps) {
  return (
    <div className="journal-actions">
      <button
        type="button"
        className="journal-action journal-action-like"
        aria-pressed={isLiked}
        aria-label={`Like the ${photo.place} photo`}
        onClick={onToggleLike}
      >
        <Icon path={icons.heart} filled={isLiked} />
      </button>
      <button type="button" className="journal-action" aria-label={`Share the ${photo.place} photo`} onClick={onShare}>
        <Icon path={icons.share} />
      </button>
      <button
        type="button"
        className="journal-action journal-action-save"
        aria-pressed={isSaved}
        aria-label={`Save the ${photo.place} photo`}
        onClick={onToggleSave}
      >
        <Icon path={icons.bookmark} filled={isSaved} />
      </button>
    </div>
  );
}

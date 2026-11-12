"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { JournalPhoto, JournalQuote } from "./journal-data";
import PostActions from "./post-actions";

type PhotoViewerProps = {
  photos: JournalPhoto[];
  // The saying shown beside each photo on the rail, if it has one.
  sayings: Map<string, JournalQuote>;
  index: number | null;
  liked: Set<string>;
  saved: Set<string>;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (photo: JournalPhoto) => void;
  onChange: (index: number) => void;
  onClose: () => void;
};

// One photo laid out like an Instagram post: the photo, and a side panel with
// the place, the caption, and the actions. The native <dialog> gives us Escape
// to close, a focus trap, and the backdrop without extra code.
export default function PhotoViewer(props: PhotoViewerProps) {
  const { photos, sayings, index, liked, saved, onToggleLike, onToggleSave, onShare, onChange, onClose } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Increases on each double-click so the heart burst animation restarts.
  const [burst, setBurst] = useState(0);
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (photo && !dialog.open) dialog.showModal();
    if (!photo && dialog.open) dialog.close();
  }, [photo]);

  if (index === null || !photo) {
    return <dialog ref={dialogRef} className="journal-viewer" onClose={onClose} />;
  }

  const saying = sayings.get(photo.id);
  const hasPrevious = index > 0;
  const hasNext = index < photos.length - 1;

  return (
    <dialog
      ref={dialogRef}
      className="journal-viewer"
      aria-label={`${photo.place}, ${photo.date}`}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop (outside the post) closes the viewer.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        // Arrow keys move between photos, except while typing (comments come later).
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
        if (event.key === "ArrowLeft" && hasPrevious) onChange(index - 1);
        if (event.key === "ArrowRight" && hasNext) onChange(index + 1);
      }}
    >
      <article className="journal-post">
        <div
          className="journal-post-photo"
          onDoubleClick={() => {
            // Like Instagram: double-click likes (never un-likes) and shows a heart.
            if (!liked.has(photo.id)) onToggleLike(photo.id);
            setBurst((count) => count + 1);
          }}
        >
          <Image
            key={photo.id}
            src={photo.image}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 760px) 100vw, 65vw"
            priority
            draggable={false}
          />
          {burst > 0 && (
            <svg key={burst} className="journal-heart-burst" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7C19.5 15.9 12 20.5 12 20.5Z" />
            </svg>
          )}
          {hasPrevious && (
            <button type="button" className="journal-post-step is-previous" onClick={() => onChange(index - 1)} aria-label="Previous photo">
              ‹
            </button>
          )}
          {hasNext && (
            <button type="button" className="journal-post-step is-next" onClick={() => onChange(index + 1)} aria-label="Next photo">
              ›
            </button>
          )}
        </div>

        <div className="journal-post-panel">
          <header className="journal-post-header">
            <p className="journal-label">{photo.place} · {photo.date}</p>
            {/* Focus starts here (not on the photo arrows), like closing a post on Instagram. */}
            <button type="button" className="journal-post-close" onClick={() => dialogRef.current?.close()} aria-label="Close photo" autoFocus>
              ×
            </button>
          </header>

          <div className="journal-post-caption">
            {saying ? (
              <>
                <p className="journal-post-saying" lang={saying.lang}>{saying.original}</p>
                <p className="journal-post-translation">“{saying.english}”</p>
                <p className="journal-post-source">{saying.source}</p>
              </>
            ) : (
              <p className="journal-post-translation">{photo.place}, {photo.date}.</p>
            )}
          </div>

          <footer className="journal-post-footer">
            <PostActions
              photo={photo}
              isLiked={liked.has(photo.id)}
              isSaved={saved.has(photo.id)}
              onToggleLike={() => onToggleLike(photo.id)}
              onToggleSave={() => onToggleSave(photo.id)}
              onShare={() => onShare(photo)}
            />
            <p className="journal-post-meta">{index + 1} of {photos.length} · {photo.date}</p>
          </footer>
        </div>
      </article>
    </dialog>
  );
}

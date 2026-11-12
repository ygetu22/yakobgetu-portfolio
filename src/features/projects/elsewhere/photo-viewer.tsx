"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { JournalPhoto, JournalQuote } from "./journal-data";
import SaveButton from "./save-button";

type PhotoViewerProps = {
  photos: JournalPhoto[];
  // The saying shown beside each photo on the rail, if it has one.
  sayings: Map<string, JournalQuote>;
  index: number | null;
  saved: Set<string>;
  onToggleSave: (id: string) => void;
  onChange: (index: number) => void;
  onClose: () => void;
};

// A full-size view of one photo. The native <dialog> gives us Escape to close,
// a focus trap, and the backdrop without extra code.
export default function PhotoViewer({ photos, sayings, index, saved, onToggleSave, onChange, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
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
        // A click on the backdrop (outside the content) closes the viewer.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" && hasPrevious) onChange(index - 1);
        if (event.key === "ArrowRight" && hasNext) onChange(index + 1);
      }}
    >
      <div className="journal-viewer-content">
        <header className="journal-viewer-header">
          <p className="journal-label">{photo.place} · {photo.date}</p>
          <span className="journal-viewer-count">{index + 1} / {photos.length}</span>
          <SaveButton place={photo.place} isSaved={saved.has(photo.id)} onToggle={() => onToggleSave(photo.id)} />
          <button type="button" className="journal-viewer-close" onClick={() => dialogRef.current?.close()} aria-label="Close photo">
            ×
          </button>
        </header>

        <div className="journal-viewer-photo">
          <Image
            key={photo.id}
            src={photo.image}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="90vw"
            priority
          />
        </div>

        {saying && (
          <p className="journal-viewer-saying">
            <span lang={saying.lang}>{saying.original}</span> · “{saying.english}”
          </p>
        )}

        <nav className="journal-viewer-nav" aria-label="Photos">
          <button type="button" onClick={() => onChange(index - 1)} disabled={!hasPrevious} aria-label="Previous photo">
            ←
          </button>
          <button type="button" onClick={() => onChange(index + 1)} disabled={!hasNext} aria-label="Next photo">
            →
          </button>
        </nav>
      </div>
    </dialog>
  );
}

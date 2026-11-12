"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { JournalEntry, JournalPhoto, JournalQuote } from "./journal-data";
import { usePhotoSet } from "./photo-sets";
import PhotoViewer from "./photo-viewer";
import PostActions, { sharePhoto } from "./post-actions";
import { tibebBand } from "./tibeb";

// How far the mouse must move before a press counts as a drag instead of a click.
const DRAG_THRESHOLD_PX = 5;

const bandStyle = {
  "--tibeb-band": tibebBand.url,
  "--tibeb-band-height": `${tibebBand.height}px`,
} as CSSProperties;

type PhotoPrintProps = {
  photo: JournalPhoto;
  isLiked: boolean;
  isSaved: boolean;
  onOpen: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onShare: () => void;
};

function PhotoPrint({ photo, isLiked, isSaved, onOpen, onToggleLike, onToggleSave, onShare }: PhotoPrintProps) {
  const shape = photo.height > photo.width ? "is-tall" : "is-wide";
  return (
    <figure className={`journal-print ${shape}`}>
      <figcaption className="journal-label">
        {photo.place} · {photo.date}
      </figcaption>
      <button type="button" className="journal-mat" onClick={onOpen} aria-label={`Open photo: ${photo.place}, ${photo.date}`}>
        <Image
          src={photo.image}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 480px) 80vw, 45vw"
          draggable={false}
        />
      </button>
      <PostActions
        photo={photo}
        isLiked={isLiked}
        isSaved={isSaved}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    </figure>
  );
}

function ProverbCard({ quote }: { quote: JournalQuote }) {
  return (
    <blockquote className="journal-proverb">
      <p className="journal-proverb-original" lang={quote.lang}>{quote.original}</p>
      <p className="journal-proverb-english">“{quote.english}”</p>
      <footer>{quote.source}</footer>
    </blockquote>
  );
}

type PhotoJournalProps = {
  entries: JournalEntry[];
  // From a shared link like /projects/elsewhere?photo=fuji-2025
  initialPhotoId?: string;
};

// Keeps the address bar pointing at the open photo, so it can be copied or shared.
function showPhotoInAddressBar(photoId: string | null) {
  const url = new URL(window.location.href);
  if (photoId) url.searchParams.set("photo", photoId);
  else url.searchParams.delete("photo");
  window.history.replaceState(null, "", url);
}

export default function PhotoJournal({ entries, initialPhotoId }: PhotoJournalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; scroll: number; pointerId: number; moved: boolean } | null>(null);
  // Set when a drag just ended, so the click that follows it doesn't open a photo.
  const suppressClickRef = useRef(false);
  const cancelMotion = useRef<() => void>(() => {});
  const [isDragging, setIsDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const allPhotos = entries.filter((entry): entry is JournalPhoto => entry.kind === "photo");
  const allPhotoIds = allPhotos.map((photo) => photo.id);
  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    const index = allPhotoIds.indexOf(initialPhotoId ?? "");
    return index === -1 ? null : index;
  });
  const [view, setView] = useState<"all" | "saved">("all");
  const [shareNotice, setShareNotice] = useState("");
  const shareNoticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { ids: liked, toggle: toggleLike } = usePhotoSet("elsewhere:liked-photos", allPhotoIds);
  const { ids: saved, toggle: toggleSave } = usePhotoSet("elsewhere:saved-photos", allPhotoIds);
  // The saved view shows only the visitor's saved photos, without the sayings.
  const visibleEntries = view === "all" ? entries : allPhotos.filter((photo) => saved.has(photo.id));
  const photos = visibleEntries.filter((entry): entry is JournalPhoto => entry.kind === "photo");
  const sayings = new Map<string, JournalQuote>();
  entries.forEach((entry, position) => {
    const previous = entries[position - 1];
    if (entry.kind === "quote" && previous?.kind === "photo") sayings.set(previous.id, entry);
  });

  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let target = rail.scrollLeft;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      rail?.scrollTo({ left: rail.scrollLeft, behavior: "instant" });
    }
    cancelMotion.current = stop;

    function animate() {
      if (!rail) return;
      const difference = target - rail.scrollLeft;
      if (Math.abs(difference) < 3) {
        rail.scrollLeft = target;
        frame = 0;
        return;
      }
      rail.scrollLeft += difference * 0.2;
      frame = requestAnimationFrame(animate);
    }

    function onWheel(event: WheelEvent) {
      if (!rail || event.ctrlKey) return;
      event.preventDefault();
      if (!frame) rail.scrollTo({ left: rail.scrollLeft, behavior: "instant" });
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1;
      target = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, (frame ? target : rail.scrollLeft) + delta * unit));
      if (reducedMotion.matches) {
        stop();
        rail.scrollLeft = target;
      } else if (!frame) {
        frame = requestAnimationFrame(animate);
      }
    }

    function updateEdges() {
      if (!rail) return;
      const start = rail.scrollLeft < 2;
      const end = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
      setEdges((previous) => previous.start === start && previous.end === end ? previous : { start, end });
    }

    const observer = new ResizeObserver(() => { stop(); updateEdges(); });
    observer.observe(rail);
    root.addEventListener("wheel", onWheel, { passive: false });
    rail.addEventListener("scroll", updateEdges, { passive: true });
    rail.addEventListener("pointerdown", stop);
    return () => {
      stop();
      observer.disconnect();
      root.removeEventListener("wheel", onWheel);
      rail.removeEventListener("scroll", updateEdges);
      rail.removeEventListener("pointerdown", stop);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function openPhoto(index: number) {
    setOpenIndex(index);
    showPhotoInAddressBar(photos[index]?.id ?? null);
  }

  function closePhoto() {
    setOpenIndex(null);
    showPhotoInAddressBar(null);
  }

  async function share(photo: JournalPhoto) {
    const result = await sharePhoto(photo);
    if (result === "shared") return;
    clearTimeout(shareNoticeTimer.current);
    setShareNotice(result === "copied" ? "Link copied" : "Couldn't share this photo");
    shareNoticeTimer.current = setTimeout(() => setShareNotice(""), 2400);
  }

  function showView(next: "all" | "saved") {
    setView(next);
    railRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }

  function move(direction: number | "start" | "end") {
    const rail = railRef.current;
    if (!rail) return;
    cancelMotion.current();
    const left = direction === "start" ? 0 : direction === "end" ? rail.scrollWidth : rail.scrollLeft + direction * rail.clientWidth * 0.8;
    rail.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <>
      <div ref={rootRef} className="journal-world" style={bandStyle}>
        <div className="journal-band journal-band-top" aria-hidden="true" />
        <div className="journal-band journal-band-bottom" aria-hidden="true" />
        <header className="journal-header">
          <div className="journal-header-right">
            <div className="journal-title-lockup">
              <h1>Elsewhere</h1>
              <span className="journal-title-alt"><span lang="am">ትዝታ</span><small>Tizita</small></span>
            </div>
            <div className="journal-views" role="group" aria-label="Show photos">
              <button type="button" aria-pressed={view === "all"} onClick={() => showView("all")}>All</button>
              <button type="button" aria-pressed={view === "saved"} onClick={() => showView("saved")}>
                Saved {saved.size}
              </button>
            </div>
          </div>
        </header>
        <div
          id="journal-rail"
          ref={railRef}
          role="region"
          aria-label="Elsewhere horizontal photo canvas"
          aria-describedby="journal-instructions"
          tabIndex={0}
          className={`journal-rail${isDragging ? " is-dragging" : ""}`}
          onKeyDown={(event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            const directions: Record<string, number | "start" | "end"> = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1, PageDown: 1, PageUp: -1, Home: "start", End: "end" };
            if (event.key in directions) { event.preventDefault(); move(directions[event.key]); }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            dragRef.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, pointerId: event.pointerId, moved: false };
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (!drag) return;
            const distance = event.clientX - drag.x;
            // Only start dragging after real movement, so a plain click still reaches the photo.
            if (!drag.moved && Math.abs(distance) > DRAG_THRESHOLD_PX) {
              drag.moved = true;
              event.currentTarget.setPointerCapture(drag.pointerId);
              setIsDragging(true);
            }
            if (drag.moved) event.currentTarget.scrollLeft = drag.scroll - distance;
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            suppressClickRef.current = Boolean(dragRef.current?.moved);
            dragRef.current = null;
            setIsDragging(false);
          }}
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return;
            suppressClickRef.current = false;
            event.preventDefault();
            event.stopPropagation();
          }}
          onLostPointerCapture={() => { dragRef.current = null; setIsDragging(false); }}
          onPointerCancel={() => { dragRef.current = null; setIsDragging(false); }}
        >
          <div className="journal-canvas">
            {visibleEntries.map((entry) =>
              entry.kind === "photo" ? (
                <PhotoPrint
                  key={entry.id}
                  photo={entry}
                  isLiked={liked.has(entry.id)}
                  isSaved={saved.has(entry.id)}
                  onOpen={() => openPhoto(photos.indexOf(entry))}
                  onToggleLike={() => toggleLike(entry.id)}
                  onToggleSave={() => toggleSave(entry.id)}
                  onShare={() => share(entry)}
                />
              ) : (
                <ProverbCard key={entry.id} quote={entry} />
              ),
            )}
            {visibleEntries.length === 0 && (
              <p className="journal-empty">
                Nothing saved yet. Tap the bookmark under a photo to keep it here. Saves stay in this browser on this device.
              </p>
            )}
          </div>
        </div>
        <footer className="journal-footer">
          <p id="journal-instructions"><span className="journal-instruction-en">Scroll to wander</span> <span aria-hidden="true">⟶</span><span className="journal-welcome" lang="am">እንኳን ደህና መጣህ</span><span className="sr-only">. Swipe or drag horizontally, or focus the canvas and use the arrow keys.</span></p>
          <div className="journal-navigation">
            <button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label="Move left" aria-controls="journal-rail">←</button>
            <button type="button" onClick={() => move(1)} disabled={edges.end} aria-label="Move right" aria-controls="journal-rail">→</button>
          </div>
        </footer>
      </div>
      <PhotoViewer
        photos={photos}
        sayings={sayings}
        index={openIndex}
        liked={liked}
        saved={saved}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
        onShare={share}
        onChange={openPhoto}
        onClose={closePhoto}
      />
      <p className="journal-toast" role="status" aria-live="polite">{shareNotice}</p>
    </>
  );
}

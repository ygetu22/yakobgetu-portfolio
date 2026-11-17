"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { pointer, usePointerFrame } from "@/components/motion/pointer-motion";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import type { JournalPhoto } from "./journal-data";
import styles from "./journal.module.css";

const EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const LOUPE_ZOOM = 2.2;
const LOUPE_RADIUS_PX = 75;

type PhotoViewerProps = {
  photos: JournalPhoto[];
  // Index of the photo being shown, or null when the viewer is closed.
  openIndex: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

function shotFrame(photo: JournalPhoto): HTMLElement | null {
  return document.querySelector(`#shot-${CSS.escape(photo.id)} [data-shot-frame]`);
}

// The transform that makes `image` sit exactly over another rectangle on screen.
function transformOnto(image: HTMLElement, target: DOMRect): string {
  const own = image.getBoundingClientRect();
  const scaleX = target.width / own.width;
  const scaleY = target.height / own.height;
  return `translate(${target.left - own.left}px, ${target.top - own.top}px) scale(${scaleX}, ${scaleY})`;
}

// A full-screen view of one photo. It grows out of the photo that was clicked and shrinks back
// into it when closed. Arrow keys move between photos, Escape closes, and with a mouse a round
// magnifying glass follows the pointer. A native <dialog> keeps keyboard focus inside it.
export default function PhotoViewer({ photos, openIndex, onChange, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const lastStep = useRef(0);
  const photo = openIndex === null ? null : photos[openIndex];
  const isOpen = photo !== null;

  // Open the dialog and grow the picture out of its place on the page.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog || dialog.open) return;

    dialog.showModal();
    const image = imageRef.current;
    const frame = photo ? shotFrame(photo) : null;
    if (image && frame && !prefersReducedMotion()) {
      image.animate(
        [{ transform: transformOnto(image, frame.getBoundingClientRect()) }, { transform: "none" }],
        { duration: 560, easing: EASING },
      );
    }
    // Only the open/closed change matters here; moving between photos is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Moving to another photo: keep the page behind in step, and slide the new picture in.
  useEffect(() => {
    if (!photo || lastStep.current === 0) return;

    shotFrame(photo)?.scrollIntoView({ block: "center", behavior: "instant" });
    if (!prefersReducedMotion()) {
      imageRef.current?.animate(
        [{ opacity: 0, transform: `translateX(${lastStep.current * 48}px)` }, { opacity: 1, transform: "none" }],
        { duration: 380, easing: EASING },
      );
    }
    lastStep.current = 0;
  }, [photo]);

  function step(direction: 1 | -1) {
    if (openIndex === null) return;
    lastStep.current = direction;
    onChange((openIndex + direction + photos.length) % photos.length);
  }

  async function close() {
    const dialog = dialogRef.current;
    const image = imageRef.current;
    const frame = photo ? shotFrame(photo) : null;

    if (image && frame && !prefersReducedMotion()) {
      dialog?.classList.add(styles.closing);
      await image.animate(
        [{ transform: "none" }, { transform: transformOnto(image, frame.getBoundingClientRect()) }],
        { duration: 460, easing: EASING },
      ).finished;
      dialog?.classList.remove(styles.closing);
    }

    dialog?.close();
    onClose();
    frame?.focus({ preventScroll: true });
  }

  usePointerFrame(() => {
    const loupe = loupeRef.current;
    const image = imageRef.current;
    if (!loupe || !image) return;

    const box = image.getBoundingClientRect();
    const isOverImage =
      isOpen &&
      pointer.isActive &&
      pointer.x >= box.left &&
      pointer.x <= box.right &&
      pointer.y >= box.top &&
      pointer.y <= box.bottom;

    loupe.classList.toggle(styles.loupeActive, isOverImage);
    if (!isOverImage) return;

    loupe.style.backgroundImage = `url("${image.currentSrc}")`;
    loupe.style.backgroundSize = `${box.width * LOUPE_ZOOM}px ${box.height * LOUPE_ZOOM}px`;
    const offsetX = LOUPE_RADIUS_PX - (pointer.x - box.left) * LOUPE_ZOOM;
    const offsetY = LOUPE_RADIUS_PX - (pointer.y - box.top) * LOUPE_ZOOM;
    loupe.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    loupe.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
  });

  const position =
    openIndex === null
      ? ""
      : `${String(openIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

  return (
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-label="Photo viewer"
      // Escape asks to close; run the same shrink-back animation instead of closing instantly.
      onCancel={(event) => {
        event.preventDefault();
        void close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        else if (event.key === "ArrowLeft") step(-1);
      }}
      // A click on the dimmed area around the photo closes the viewer.
      onClick={(event) => {
        if (event.target === event.currentTarget) void close();
      }}
    >
      {photo && (
        <>
          <Image
            ref={imageRef}
            className={styles.viewerImage}
            src={photo.image}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="92vw"
            // Fit the whole photo on screen, leaving room for the caption and buttons underneath.
            style={{ width: `min(92vw, calc((100svh - 170px) * ${photo.width / photo.height}))`, height: "auto" }}
          />
          <p className={styles.viewerCaption} aria-live="polite">
            <span aria-hidden="true">{position} · </span>
            {photo.place} · {photo.date}
          </p>
          <div className={styles.viewerControls}>
            <button type="button" className="round-button" aria-label="Previous photo" onClick={() => step(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className="round-button" aria-label="Close the photo" autoFocus onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
            <button type="button" className="round-button" aria-label="Next photo" onClick={() => step(1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      )}
      <div ref={loupeRef} className={styles.loupe} aria-hidden="true" />
    </dialog>
  );
}

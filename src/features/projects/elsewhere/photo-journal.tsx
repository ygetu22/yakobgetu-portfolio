"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { JournalScene } from "@/features/projects/elsewhere/journal-data";

const sceneDetails = [
  { numeral: "፩", folio: "01", word: "ትዝታ" },
  { numeral: "፪", folio: "02", word: "ጉዞ" },
  { numeral: "፫", folio: "03", word: "ታሪክ" },
];

function ManuscriptOrnament({ variant }: { variant: number }) {
  const detail = sceneDetails[variant - 1] ?? sceneDetails[0];
  return (
    <div className="journal-folio-mark" aria-hidden="true">
      <span lang="am">{detail.word}</span>
      <span>{detail.folio} / 03 · {detail.numeral}</span>
    </div>
  );
}

function ManuscriptFrame() {
  return (
    <div className="journal-frame" aria-hidden="true">
      {(["top", "bottom"] as const).map((edge) => (
        <svg key={edge} className={`journal-border journal-border-${edge}`}>
          <defs>
            <pattern id={`harag-${edge}`} width="40" height="18" patternUnits="userSpaceOnUse">
              <path className="journal-pattern-ink" d="m20 3 16 6-16 6L4 9Z" />
              <path className="journal-pattern-red" d="m20 6 8 3-8 3-8-3Z" />
              <circle className="journal-pattern-gold" cx="20" cy="9" r="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="18" fill={`url(#harag-${edge})`} />
        </svg>
      ))}
    </div>
  );
}

export default function PhotoJournal({ scenes }: { scenes: JournalScene[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; scroll: number } | null>(null);
  const cancelMotion = useRef<() => void>(() => {});
  const [isDragging, setIsDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

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

  function move(direction: number | "start" | "end") {
    const rail = railRef.current;
    if (!rail) return;
    cancelMotion.current();
    const left = direction === "start" ? 0 : direction === "end" ? rail.scrollWidth : rail.scrollLeft + direction * rail.clientWidth * 0.8;
    rail.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <div ref={rootRef} className="journal-world">
      <ManuscriptFrame />
      <header className="journal-header">
        <div className="journal-header-right">
          <div className="journal-title-lockup">
            <h1>Elsewhere</h1>
            <span className="journal-title-alt"><span lang="am">ትዝታ</span><small>Tizita</small></span>
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
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          dragRef.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
          setIsDragging(true);
        }}
        onPointerMove={(event) => {
          if (dragRef.current) event.currentTarget.scrollLeft = dragRef.current.scroll - (event.clientX - dragRef.current.x);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          dragRef.current = null;
          setIsDragging(false);
        }}
        onLostPointerCapture={() => { dragRef.current = null; setIsDragging(false); }}
        onPointerCancel={() => { dragRef.current = null; setIsDragging(false); }}
      >
        <div className="journal-canvas">
          {scenes.map((scene, sceneIndex) => (
            <section key={scene.id} className={`journal-scene journal-scene-${sceneIndex % 3 + 1}`} aria-label={`Composition ${sceneIndex + 1}`}>
              <ManuscriptOrnament variant={sceneIndex + 1} />
              <div className="journal-composition">
                {scene.items.map((item, itemIndex) => item.kind === "photo" ? (
                  <figure key={item.id} className={`journal-piece journal-slot-${itemIndex + 1}`} data-photo={item.id}>
                    <figcaption className="journal-label">{item.label}</figcaption>
                    <div className="journal-photo">
                      {item.image ? (
                        <Image src={item.image} alt={item.alt} fill sizes="(max-width: 900px) 400px, 40vw" className="object-cover" draggable={false} />
                      ) : (
                        <div className="journal-photo-placeholder" role="img" aria-label={`Photo ${item.id.replace("photo-", "")} placeholder`}>
                          <span lang="am">ምስል</span>
                          <b>{item.id.replace("photo-", "")}</b>
                        </div>
                      )}
                    </div>
                  </figure>
                ) : (
                  <div key={item.id} className={`journal-piece journal-note journal-note-${item.kind} journal-slot-${itemIndex + 1}`}>
                    {item.kind === "quote" ? <blockquote>{item.text}</blockquote> : <p>{item.text}</p>}
                    <span className="journal-note-signature" aria-hidden="true">— yg</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
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
  );
}

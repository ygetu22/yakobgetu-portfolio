"use client";

import Image from "next/image";
import { useRef } from "react";
import { clamp, ease } from "@/components/motion/motion-math";
import { usePointerFrame } from "@/components/motion/pointer-motion";
import type { LifePhoto } from "./life-photos";
import styles from "./life.module.css";

// A row of photos that slides sideways as the page scrolls past it.
// On touch screens, or with reduced motion, it is an ordinary sideways-scrolling row.
export default function LifeStrip({ photos }: { photos: LifePhoto[] }) {
  const windowRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const offset = useRef(0);

  usePointerFrame(() => {
    const frame = windowRef.current;
    const strip = stripRef.current;
    if (!frame || !strip) return;

    const box = frame.getBoundingClientRect();
    const isNearScreen = box.bottom > -200 && box.top < window.innerHeight + 200;
    if (!isNearScreen) return;

    // 0 when the row enters at the bottom of the screen, 1 when it leaves at the top.
    const travelled = clamp((window.innerHeight - box.top) / (window.innerHeight + box.height), 0, 1);
    const slack = Math.max(0, strip.scrollWidth - frame.clientWidth);
    offset.current = ease(offset.current, -travelled * slack, 0.1);
    strip.style.transform = `translateX(${offset.current.toFixed(1)}px)`;
  });

  return (
    <div ref={windowRef} className={styles.window} role="group" aria-label="Photos from places I've been" tabIndex={0}>
      <ul ref={stripRef} className={styles.strip}>
        {photos.map((photo) => (
          <li key={photo.id}>
            <figure className={styles.photo}>
              <Image
                src={photo.image}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 800px) 60vw, 320px"
              />
              <figcaption>
                {photo.place} · {photo.date}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

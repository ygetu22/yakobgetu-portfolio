"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SiteLink } from "@/components/layout/page-curtain";
import { clamp, ease } from "@/components/motion/motion-math";
import { pointer, usePointerFrame } from "@/components/motion/pointer-motion";
import type { Project } from "./projects";
import styles from "./project-index.module.css";

const PREVIEW_WIDTH_PX = 336;
const PREVIEW_HEIGHT_PX = 290;

type ProjectIndexProps = {
  projects: Project[];
  // Number shown beside the first row (the Projects page continues Home's numbering).
  startNumber?: number;
};

// Projects as a list of large names. With a mouse, a small picture of the hovered project
// floats beside the pointer; on touch screens each row shows its summary instead.
export default function ProjectIndex({ projects, startNumber = 1 }: ProjectIndexProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const preview = useRef({ x: 0, y: 0, tilt: 0 });
  const scroll = useRef({ lastY: 0, lean: 0 });
  const hovered = projects.find((project) => project.id === hoveredId);

  usePointerFrame(() => {
    // The preview trails the pointer and tilts with how fast it is moving sideways.
    const targetX = Math.min(pointer.x + 28, window.innerWidth - PREVIEW_WIDTH_PX - 24);
    const targetY = clamp(pointer.y - 110, 12, window.innerHeight - PREVIEW_HEIGHT_PX);
    const sidewaysSpeed = targetX - preview.current.x;
    preview.current.x = ease(preview.current.x, targetX, 0.13);
    preview.current.y = ease(preview.current.y, targetY, 0.13);
    preview.current.tilt = ease(preview.current.tilt, clamp(sidewaysSpeed * 0.12, -7, 7), 0.1);
    if (previewRef.current) {
      const { x, y, tilt } = preview.current;
      const move = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      previewRef.current.style.transform = `${move} rotate(${tilt.toFixed(2)}deg)`;
    }

    // The whole list leans slightly in the direction of a fast scroll, then settles.
    const scrollSpeed = window.scrollY - scroll.current.lastY;
    scroll.current.lastY = window.scrollY;
    scroll.current.lean = ease(scroll.current.lean, clamp(scrollSpeed * 0.035, -1.6, 1.6), 0.12);
    listRef.current?.style.setProperty("--lean", `${scroll.current.lean.toFixed(3)}deg`);
  });

  return (
    <>
      <ul ref={listRef} className={styles.index} onPointerLeave={() => setHoveredId(null)} data-cursor-hide>
        {projects.map((project, index) => (
          <li key={project.id}>
            <SiteLink
              href={project.href}
              curtainTitle={project.name}
              className={styles.row}
              onPointerEnter={() => setHoveredId(project.id)}
            >
              <span className={`muted ${styles.number}`} aria-hidden="true">
                {String(startNumber + index).padStart(2, "0")}
              </span>
              <span className={`display-heading ${styles.name}`}>{project.name}</span>
              <span className={`muted ${styles.kind}`}>{project.kind}</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
              <span className={styles.summary}>{project.summary}</span>
            </SiteLink>
          </li>
        ))}
      </ul>

      {/* Decorative: the same summary is in each row for screen readers and touch screens. */}
      <div ref={previewRef} className={`${styles.preview} ${hovered ? styles.previewActive : ""}`} aria-hidden="true">
        <div className={styles.frame}>
          {projects.map((project) => (
            <span key={project.id} className={project.id === hoveredId ? styles.currentArt : undefined}>
              <Image
                className={styles.lightArt}
                src={`/projects/${project.id}/preview-light.png`}
                alt=""
                width={668}
                height={374}
                sizes="336px"
              />
              <Image
                className={styles.darkArt}
                src={`/projects/${project.id}/preview-dark.png`}
                alt=""
                width={668}
                height={374}
                sizes="336px"
              />
            </span>
          ))}
        </div>
        <p>{hovered?.summary}</p>
      </div>
    </>
  );
}

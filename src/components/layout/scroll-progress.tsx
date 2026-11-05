"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./scroll-progress.module.css";

export default function ScrollProgress() {
  const pathname = usePathname();
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trackElement = track.current;
    const fillElement = fill.current;
    if (!trackElement || !fillElement) return;

    const journal = pathname === "/projects/elsewhere"
      ? document.getElementById("journal-rail")
      : null;
    const scrollTarget = journal ?? window;
    let frame = 0;

    function update() {
      frame = 0;
      if (!trackElement || !fillElement) return;

      const distance = journal
        ? journal.scrollWidth - journal.clientWidth
        : document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const position = journal ? journal.scrollLeft : window.scrollY;
      const progress = distance > 0 ? Math.max(0, Math.min(1, position / distance)) : 0;

      trackElement.hidden = distance <= 0;
      fillElement.style.transform = `scaleX(${progress})`;
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    scrollTarget.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    // Content can grow after images load or technology badges expand.
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(journal ?? document.documentElement);
    const content = journal?.firstElementChild ?? document.querySelector("main");
    if (content) observer.observe(content);
    scheduleUpdate();

    return () => {
      scrollTarget.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <div ref={track} className={styles.track} hidden aria-hidden="true">
      <div ref={fill} className={styles.fill} />
    </div>
  );
}

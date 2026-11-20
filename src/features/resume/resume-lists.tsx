"use client";

import { useRef, useState } from "react";
import { useLocationHash } from "@/components/layout/location-hash";
import { clamp } from "@/components/motion/motion-math";
import { useScrollFrame } from "@/components/motion/scroll-frame";
import { experience, leadership, type TimelineEntry } from "./resume-data";
import ResumeEntry from "./resume-entry";
import styles from "./resume.module.css";

// Keeps track of which rows are open. A link such as /#entry-mlt opens that row.
function useOpenEntries(entries: TimelineEntry[], initiallyOpen: string[]) {
  const [openIds, setOpenIds] = useState(() => new Set(initiallyOpen));
  const hash = useLocationHash();
  const [handledHash, setHandledHash] = useState("");

  // React's pattern for reacting to a changed value during render: remember the last one handled.
  if (hash !== handledHash) {
    setHandledHash(hash);
    const linked = entries.find((entry) => hash === `entry-${entry.id}`);
    if (linked) setOpenIds(new Set(openIds).add(linked.id));
  }

  function toggle(id: string) {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenIds(next);
  }

  return { openIds, toggle };
}

// Jobs, newest first, along a line that fills in as the reader scrolls down it.
export function ExperienceTimeline() {
  // The most recent job starts open so the section never looks empty.
  const { openIds, toggle } = useOpenEntries(experience, [experience[0].id]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [passedCount, setPassedCount] = useState(0);

  useScrollFrame(() => {
    const timeline = timelineRef.current;
    const fill = fillRef.current;
    if (!timeline || !fill) return;

    const box = timeline.getBoundingClientRect();
    const readingLine = window.innerHeight * 0.62;
    fill.style.transform = `scaleY(${clamp((readingLine - box.top) / box.height, 0, 1).toFixed(3)})`;

    const rows = [...timeline.querySelectorAll<HTMLElement>(`.${styles.entryHead}`)];
    const passed = rows.filter((row) => {
      const rowBox = row.getBoundingClientRect();
      return rowBox.top + rowBox.height / 2 < readingLine;
    });
    setPassedCount(passed.length);
  });

  return (
    <div ref={timelineRef} className={styles.timeline}>
      <div ref={fillRef} className={styles.timelineFill} aria-hidden="true" />
      <ul className={styles.entries}>
        {experience.map((entry, index) => (
          <ResumeEntry
            key={entry.id}
            entry={entry}
            isOpen={openIds.has(entry.id)}
            onToggle={() => toggle(entry.id)}
            isPassed={index < passedCount}
          />
        ))}
      </ul>
    </div>
  );
}

export function LeadershipList() {
  const { openIds, toggle } = useOpenEntries(leadership, []);

  return (
    <ul className={styles.entries}>
      {leadership.map((entry) => (
        <ResumeEntry
          key={entry.id}
          entry={entry}
          isOpen={openIds.has(entry.id)}
          onToggle={() => toggle(entry.id)}
        />
      ))}
    </ul>
  );
}

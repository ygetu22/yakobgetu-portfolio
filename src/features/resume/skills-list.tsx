"use client";

import { useState } from "react";
import { projects } from "@/features/projects/projects";
import { experience, skillGroups } from "./resume-data";
import { buildSkillUsage, skillElementId } from "./skill-usage";
import styles from "./resume.module.css";

const skillUsage = buildSkillUsage([
  ...experience.map((job) => ({ label: job.shortName ?? job.name, stack: job.stack })),
  ...projects.map((project) => ({ label: project.name, stack: project.stack })),
]);

const HINT = "Hover or tap a dashed skill to see where I used it.";

// Skills in groups. The ones with a dashed outline were used in a job or project on this site,
// and say where when pointed at, focused or tapped.
export default function SkillsList() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const usedIn = activeSkill ? skillUsage.get(activeSkill) : undefined;

  return (
    <>
      <p className={`${styles.skillCaption} ${usedIn ? styles.captionActive : ""}`} aria-live="polite">
        {usedIn ? `${activeSkill} → ${usedIn.join(", ")}` : HINT}
      </p>

      <dl className={styles.skillGroups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <dt>{group.label}</dt>
            <dd>
              {group.items.map((skill) =>
                skillUsage.has(skill) ? (
                  <button
                    key={skill}
                    id={skillElementId(skill)}
                    type="button"
                    className={`skill-tag ${styles.linkedSkill}`}
                    onPointerEnter={() => setActiveSkill(skill)}
                    onPointerLeave={() => setActiveSkill(null)}
                    onFocus={() => setActiveSkill(skill)}
                    onBlur={() => setActiveSkill(null)}
                  >
                    {skill}
                  </button>
                ) : (
                  <span key={skill} id={skillElementId(skill)} className="skill-tag">
                    {skill}
                  </span>
                ),
              )}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

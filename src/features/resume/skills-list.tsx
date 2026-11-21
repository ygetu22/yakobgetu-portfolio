"use client";

import { useState } from "react";
import { useIsPhone } from "@/components/ui/use-is-phone";
import { projects } from "@/features/projects/projects";
import { experience, otherSkillUses, skillGroups } from "./resume-data";
import { buildSkillUsage, skillElementId } from "./skill-usage";
import styles from "./resume.module.css";

const skillUsage = buildSkillUsage([
  ...experience.map((job) => ({ label: job.shortName ?? job.name, stack: job.stack })),
  ...projects.map((project) => ({ label: project.name, stack: project.stack })),
  ...otherSkillUses,
]);

const HINT = "Hover or tap a dashed skill to see where I used it.";
const PHONE_HINT = "Tap a skill to see where I used it.";

// Skills in groups. The ones with a dashed outline were used in a job or project on this site,
// and say where when pointed at, focused or tapped. On phones one group shows at a time,
// picked from a row of tabs.
export default function SkillsList() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [shownGroup, setShownGroup] = useState(skillGroups[0].label);
  const isPhone = useIsPhone();
  const usedIn = activeSkill ? skillUsage.get(activeSkill) : undefined;

  return (
    <>
      <div className={styles.groupTabs} role="tablist" aria-label="Skill groups">
        {skillGroups.map((group) => (
          <button
            key={group.label}
            type="button"
            role="tab"
            aria-selected={group.label === shownGroup}
            onClick={() => {
              setShownGroup(group.label);
              setActiveSkill(null);
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      <p className={`${styles.skillCaption} ${usedIn ? styles.captionActive : ""}`} aria-live="polite">
        {usedIn ? `${activeSkill} → ${usedIn.join(", ")}` : isPhone ? PHONE_HINT : HINT}
      </p>

      <dl className={styles.skillGroups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup} data-shown={group.label === shownGroup}>
            <dt>{group.label}</dt>
            <dd>
              {group.items.map((skill) =>
                skillUsage.has(skill) ? (
                  <button
                    key={skill}
                    id={skillElementId(skill)}
                    type="button"
                    className={`skill-tag ${styles.linkedSkill}`}
                    // A finger also sends enter and leave, which would clear the answer as soon as
                    // the tap ends, so touch uses the click instead.
                    onPointerEnter={(event) => event.pointerType === "mouse" && setActiveSkill(skill)}
                    onPointerLeave={(event) => event.pointerType === "mouse" && setActiveSkill(null)}
                    onClick={() => setActiveSkill(skill)}
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

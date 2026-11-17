import type { ReactNode } from "react";
import Reveal from "@/components/motion/reveal";
import { education } from "./resume-data";
import { ExperienceTimeline, LeadershipList } from "./resume-lists";
import SkillsList from "./skills-list";
import styles from "./resume.module.css";

const RESUME_PDF = "/documents/yakob_getu_resume.pdf";

export function DownloadResumeLink() {
  return (
    <a className="pill pill-link" href={RESUME_PDF} download data-cursor="save">
      <span aria-hidden="true">↓ </span>Download PDF
    </a>
  );
}

type ResumeBlockProps = {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
};

function ResumeBlock({ id, number, title, children }: ResumeBlockProps) {
  return (
    <Reveal className={styles.block}>
      <section id={id} aria-labelledby={`${id}-title`}>
        <h3 id={`${id}-title`} className={styles.blockTitle}>
          <span className="muted" aria-hidden="true">
            {number}
          </span>
          <span className="display-heading">{title}</span>
        </h3>
        {children}
      </section>
    </Reveal>
  );
}

// The whole resume: education, experience, skills and leadership. Used on Home and on /resume.
export default function ResumeBlocks() {
  return (
    <>
      <ResumeBlock id="education" number="01" title="Education">
        <div className={styles.education}>
          <div>
            <p className={styles.school}>{education.institution}</p>
            <p className="muted">
              {education.degree} · {education.concentration}
            </p>
          </div>
          <p className={`muted ${styles.educationWhen}`}>
            {education.location}
            <br />
            {education.date}
          </p>
        </div>
        <ul className={`plain-list ${styles.honors}`}>
          {education.honors.map((honor) => (
            <li key={honor}>{honor}</li>
          ))}
        </ul>
      </ResumeBlock>

      <ResumeBlock id="experience" number="02" title="Experience">
        <ExperienceTimeline />
      </ResumeBlock>

      <ResumeBlock id="skills" number="03" title="Skills">
        <SkillsList />
      </ResumeBlock>

      <ResumeBlock id="leadership" number="04" title="Leadership">
        <LeadershipList />
      </ResumeBlock>
    </>
  );
}

import { SiteLink } from "@/components/layout/page-curtain";
import { projects } from "./projects";
import styles from "./project-steps.module.css";

type ProjectStepsProps = {
  projectId: string;
  // Where "back" goes. Most project pages return to the list; Elsewhere returns to Life on Home.
  back?: { href: string; label: string; curtainTitle: string };
};

const ALL_PROJECTS = { href: "/projects", label: "All projects", curtainTitle: "Projects" };

// The row at the top of a project page: back, plus the previous and next project.
// Large touch targets, so phone visitors never need the browser's own back button.
export default function ProjectSteps({ projectId, back = ALL_PROJECTS }: ProjectStepsProps) {
  const position = projects.findIndex((project) => project.id === projectId);
  const previous = projects[(position - 1 + projects.length) % projects.length];
  const next = projects[(position + 1) % projects.length];

  return (
    <nav className={styles.steps} aria-label="Project navigation">
      <SiteLink href={back.href} curtainTitle={back.curtainTitle} className="back-link">
        <span aria-hidden="true">←</span> {back.label}
      </SiteLink>

      <span className={styles.neighbours}>
        <SiteLink
          href={previous.href}
          curtainTitle={previous.name}
          className={styles.step}
          aria-label={`Previous project: ${previous.name}`}
          title={previous.name}
        >
          <span aria-hidden="true">←</span>
        </SiteLink>
        <SiteLink
          href={next.href}
          curtainTitle={next.name}
          className={`${styles.step} ${styles.nextStep}`}
          aria-label={`Next project: ${next.name}`}
        >
          <span className={styles.nextName}>{next.name}</span>
          <span aria-hidden="true">→</span>
        </SiteLink>
      </span>
    </nav>
  );
}

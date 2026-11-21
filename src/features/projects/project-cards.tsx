import { SiteLink } from "@/components/layout/page-curtain";
import ProjectScene from "./project-scenes";
import type { Project } from "./projects";
import styles from "./project-cards.module.css";

// How many stack items a card lists before "+N".
const STACK_SHOWN = 3;

type ProjectCardsProps = {
  projects: Project[];
  // "row" swipes sideways (Home); "column" stacks the cards (the Projects page).
  layout: "row" | "column";
};

// Phones only: each project as a card with a small looping animation, its year, summary and stack.
// Desktop keeps the list of large names in project-index.tsx.
export default function ProjectCards({ projects, layout }: ProjectCardsProps) {
  return (
    <ul className={`${styles.cards} ${layout === "row" ? styles.row : styles.column}`}>
      {projects.map((project) => {
        const hiddenStack = project.stack.length - STACK_SHOWN;
        return (
          <li key={project.id}>
            <SiteLink href={project.href} curtainTitle={project.name} className={styles.card}>
              <ProjectScene projectId={project.id} />
              <div className={styles.body}>
                <p className={styles.top}>
                  <span className={styles.name}>{project.name}</span>
                  {project.year && <span className={styles.year}>{project.year}</span>}
                </p>
                <p className={styles.kind}>{project.kind}</p>
                <p className={styles.summary}>{project.summary}</p>
                <p className={styles.stack}>
                  {project.stack.slice(0, STACK_SHOWN).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                  {hiddenStack > 0 && <span>+{hiddenStack}</span>}
                </p>
                <span className={styles.open} aria-hidden="true">
                  Open <span>›</span>
                </span>
              </div>
            </SiteLink>
          </li>
        );
      })}
    </ul>
  );
}

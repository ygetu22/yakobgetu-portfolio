import Image from "next/image";
import type { ReactNode } from "react";
import { SiteLink } from "@/components/layout/page-curtain";
import ReadAlong from "@/components/motion/read-along";
import Reveal from "@/components/motion/reveal";
import Tilt from "@/components/motion/tilt";
import WeightLetters from "@/components/motion/weight-letters";
import SectionHeading from "@/components/ui/section-heading";
import ProjectSteps from "./project-steps";
import { projects, type Project } from "./projects";
import ProjectScene from "./project-scenes";
import styles from "./project-page.module.css";

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

type ProjectPageProps = {
  project: Project;
  // A live demo or anything else specific to this project, shown under the overview.
  children?: ReactNode;
};

// The shared layout of a project's page: title, facts, artwork, what it does, and the next project.
export default function ProjectPage({ project, children }: ProjectPageProps) {
  const position = projects.findIndex((entry) => entry.id === project.id);
  const nextProject = projects[(position + 1) % projects.length];
  const number = String(position + 1).padStart(2, "0");

  return (
    <>
      <section className="section page-top" aria-labelledby="project-title">
        <ProjectSteps projectId={project.id} />
        <h1 id="project-title" className="display-heading page-title">
          <WeightLetters text={project.name} restingWeight={300} decodeOnMount />
        </h1>
        <p className={`eyebrow ${styles.eyebrow}`}>
          Project {number} · {project.kind}
        </p>
        <ReadAlong text={project.summary} className={styles.lede} />
      </section>

      <section className={`section ${styles.overview}`} aria-label="About this project">
        <Reveal>
          <dl>
            <Fact label="Kind">{project.kind}</Fact>
            {project.year && <Fact label="Year">{project.year}</Fact>}
            {project.status && <Fact label="Status">{project.status}</Fact>}
            <Fact label="Built with">
              {project.stack.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </Fact>
            {project.repositoryUrl && (
              <Fact label="Source">
                <a
                  className="text-link"
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="visit"
                >
                  View on GitHub<span className="sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </Fact>
            )}
          </dl>
        </Reveal>

        <Reveal>
          {/* Decorative: a picture of the project's card. Everything it shows is in the text beside it. */}
          <Tilt className={`desktop-only ${styles.artwork}`}>
            <Image
              className={styles.lightArt}
              src={`/projects/${project.id}/preview-light.png`}
              alt=""
              width={668}
              height={374}
              sizes="(max-width: 800px) 100vw, 560px"
            />
            <Image
              className={styles.darkArt}
              src={`/projects/${project.id}/preview-dark.png`}
              alt=""
              width={668}
              height={374}
              sizes="(max-width: 800px) 100vw, 560px"
            />
          </Tilt>
          {/* Phones show the project's looping animation instead (the same one as on its card). */}
          <div className={`phone-only ${styles.phoneScene}`} aria-hidden="true">
            <ProjectScene projectId={project.id} />
          </div>
        </Reveal>
      </section>

      {project.highlights && (
        <section className="section" aria-labelledby="highlights-title">
          <SectionHeading eyebrow="Overview" title="What it does" titleId="highlights-title" />
          <Reveal>
            <ol className={styles.highlights}>
              {project.highlights.map((highlight, index) => (
                <li key={highlight}>
                  <span className={`muted ${styles.highlightNumber}`} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="display-heading">{highlight}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      )}

      {children}

      <section className="section" aria-label="Next project">
        <Reveal>
          <SiteLink
            href={nextProject.href}
            curtainTitle={nextProject.name}
            className={styles.next}
            data-cursor="next"
          >
            <span className="eyebrow">Next project</span>
            <span className={`display-heading ${styles.nextName}`}>{nextProject.name}</span>
            <span className={`muted ${styles.nextKind}`}>{nextProject.kind}</span>
          </SiteLink>
        </Reveal>
      </section>
    </>
  );
}

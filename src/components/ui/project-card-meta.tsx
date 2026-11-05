import styles from "./project-card-meta.module.css";

type ProjectCardMetaProps = {
  year: number;
  technologies: string[];
};

export default function ProjectCardMeta({ year, technologies }: ProjectCardMetaProps) {
  const mainTechnologies = technologies.slice(0, 3);
  const additionalTechnologies = technologies.slice(3);

  return (
    <div className="mt-5 text-[10px] uppercase tracking-wider text-foreground/50">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1" aria-label={`Project year: ${year}`}>{year}</span>
        {mainTechnologies.map((technology) => (
          <span key={technology} className="rounded bg-foreground/[0.05] px-2 py-1">
            {technology}
          </span>
        ))}
      </div>
      {additionalTechnologies.length > 0 && (
        <details className={styles.details}>
          <summary className={styles.summary}>
            <span className={styles.more}>See more <span className="text-foreground/40">+{additionalTechnologies.length}</span></span>
            <span className={styles.less}>See less</span>
            <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {additionalTechnologies.map((technology) => (
              <span key={technology} className="rounded bg-foreground/[0.05] px-2 py-1">{technology}</span>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}


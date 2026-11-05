import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";
import styles from "./project-card.module.css";

export default function GradientProject() {
  return (
    <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
      <div className="flex h-full flex-col">
        <div className={styles.preview} aria-hidden="true">
          <span className={styles.caption}>READ. REVIEW. REFINE.</span>
          <ProjectPreviewMotion variant="drift" phase={-2} className={styles.paperMotion}>
            <div className={styles.paper}>
              <div className={styles.paperHeading}><span>gradient<span className={styles.dot}>.</span></span><span className={styles.document}>01 / REVIEW</span></div>
              <div className={styles.lines}>
                {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
                <span className={styles.scan} />
              </div>
              <div className={styles.feedback}><span className={styles.check}>✓</span><span>Ideas into feedback</span></div>
            </div>
          </ProjectPreviewMotion>
          <ProjectPreviewMotion variant="breathe" phase={-1} className={styles.badge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m6 12 4 4 8-9" /></svg>
          </ProjectPreviewMotion>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="display-heading text-2xl">Gradient</h3>
            <span className="text-[10px] uppercase tracking-wider text-foreground/45">AI grader</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground/60">A collaborative AI grading project with a React interface and an Express backend.</p>
          <p className="mt-3 text-xs leading-5 text-foreground/50">Contributors: Yakob Getu <span className="text-foreground/35">(ygetu22)</span> &amp; maalin2.</p>
          <ProjectCardMeta
            year={2024}
            technologies={["Gemini API", "MongoDB", "React", "Node.js", "Express", "pdf-parse", "Multer", "Vite"]}
          />
          <p className="mt-auto pt-7 text-xs text-foreground/70">
            <ProjectCardLink href="https://github.com/ygetu22/gradient-grading-tool" label="View Gradient on GitHub (opens in a new tab)" external>
              <ActionLinkLabel>View on GitHub</ActionLinkLabel>
            </ProjectCardLink>
          </p>
        </div>
      </div>
    </article>
  );
}

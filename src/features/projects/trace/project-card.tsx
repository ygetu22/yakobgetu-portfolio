import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";
import styles from "./project-card.module.css";

export default function TraceProject() {
  return (
    <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
      <div className="flex h-full flex-col">
        <div className={styles.preview} aria-hidden="true">
          <ProjectPreviewMotion variant="drift" className={styles.previewSheet}>
            <div className={styles.previewInner}>
              <div className={styles.previewBar}><span /><span /><span /></div>
              <div className={styles.previewHeading}>Trace</div>
              <div className={styles.previewLine} /><div className={styles.previewLine} />
              <div className={styles.previewObservation}><span className={styles.dot} /> Observed checks <span>↗</span></div>
            </div>
          </ProjectPreviewMotion>
          <ProjectPreviewMotion variant="breathe" phase={-3} className={styles.previewBadge}>↳ inspect</ProjectPreviewMotion>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><h3 className="display-heading text-2xl">Trace</h3><span className="text-[10px] uppercase tracking-wider text-foreground/45">Terminal tool</span></div>
          <p className="mt-3 text-sm leading-6 text-foreground/60">Opens a site in a real browser, uses it like a visitor, and tells you what stopped working between your live site and a new version.</p>
          <ProjectCardMeta
            year={2026}
            technologies={["TypeScript", "Node.js", "Playwright", "Chromium", "ipaddr.js"]}
          />
          <p className="mt-auto pt-7 text-xs text-foreground/70">
            <ProjectCardLink href="/projects/trace" label="Explore Trace">
              <ActionLinkLabel>See it run</ActionLinkLabel>
            </ProjectCardLink>
          </p>
        </div>
      </div>
    </article>
  );
}

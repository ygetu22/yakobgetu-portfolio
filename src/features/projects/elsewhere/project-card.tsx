import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";
import motion from "@/components/motion/project-preview-motion.module.css";

export default function ElsewhereProject() {
  return (
    <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
      <div className="flex h-full flex-col">
        <div className="elsewhere-cover relative grid aspect-[16/9] place-items-center overflow-hidden border-b border-foreground/10">
          <div aria-hidden="true" className={`elsewhere-cover-lines ${motion.woven}`} />
          <div aria-hidden="true" className={`elsewhere-cover-frame ${motion.frame}`} />
          <ProjectPreviewMotion variant="breathe">
            <div className="elsewhere-cover-lockup relative text-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none">
              <span className="elsewhere-cover-emblem" aria-hidden="true">✣</span>
              <p className="mb-1 font-serif text-base text-[#8f281d]"><span lang="am">ትዝታ</span> <span className="text-[10px] uppercase tracking-[0.16em]">· Tizita</span></p>
              <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.28em] text-foreground/55">A personal photo journal</p>
              <p className="display-heading text-4xl sm:text-5xl">Elsewhere<span className="text-[#8f281d]">.</span></p>
            </div>
          </ProjectPreviewMotion>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="display-heading text-2xl">Elsewhere</h3>
            <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-foreground/50">Photo journal</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground/60">Places I&apos;ve been, moments I&apos;ve kept. A visual journal of life beyond the screen, one frame at a time.</p>
          <ProjectCardMeta year={2026} technologies={["Next.js", "React", "TypeScript", "Tailwind CSS"]} />
          <p className="mt-auto flex items-center gap-2 pt-7 text-xs text-foreground/70">
            <ProjectCardLink href="/projects/elsewhere" label="Explore Elsewhere, a photo journal">
              <ActionLinkLabel>Explore the journal</ActionLinkLabel>
            </ProjectCardLink>
          </p>
        </div>
      </div>
    </article>
  );
}

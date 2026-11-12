import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import type { CSSProperties } from "react";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";
import { tibebBand } from "./tibeb";

const bandStyle = {
  "--tibeb-band": tibebBand.url,
  "--tibeb-band-width": `${tibebBand.width}px`,
  "--tibeb-band-height": `${tibebBand.height}px`,
} as CSSProperties;

export default function ElsewhereProject() {
  return (
    <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
      <div className="flex h-full flex-col">
        <div className="elsewhere-cover relative grid aspect-[16/9] place-items-center overflow-hidden border-b border-foreground/10" style={bandStyle}>
          <div aria-hidden="true" className="elsewhere-cover-band elsewhere-cover-band-top" />
          <div aria-hidden="true" className="elsewhere-cover-band elsewhere-cover-band-bottom" />
          <ProjectPreviewMotion variant="breathe">
            <div className="elsewhere-cover-lockup relative text-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none">
              <span className="elsewhere-cover-emblem" aria-hidden="true" />
              <p className="elsewhere-cover-tizita mb-1 font-serif text-base"><span lang="am">ትዝታ</span> <span className="text-[10px] uppercase tracking-[0.16em]">· Tizita</span></p>
              <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.28em] text-foreground/55">A personal photo journal</p>
              <p className="display-heading text-4xl">Elsewhere<span className="elsewhere-cover-dot">.</span></p>
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

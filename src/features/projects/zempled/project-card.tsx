import ProjectCardLink from "@/components/ui/project-card-link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import Image from "next/image";
import ProjectCardMeta from "@/components/ui/project-card-meta";
import styles from "./collection.module.css";
import ProjectPreviewMotion from "@/components/motion/project-preview-motion";

export default function ZempledProject() {
  return <article className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 transition-colors hover:border-foreground/25">
    <div className="flex h-full flex-col">
      <div className="relative flex aspect-[16/9] items-center justify-center gap-5 overflow-hidden border-b border-foreground/10 bg-foreground/[0.025]">
        <ProjectPreviewMotion variant="sway" className="w-[33%]"><div className={`${styles.cover} -rotate-6 transition-transform duration-500 group-hover:-rotate-3 motion-reduce:transition-none`}><Image src="/projects/zempled/artwork/3313948541.jpg" alt="Mulatu Astatke album cover" width={150} height={150} /></div></ProjectPreviewMotion>
        <span className="text-foreground/35" aria-hidden="true">→</span>
        <ProjectPreviewMotion variant="sway" phase={-2.5} className="w-[33%]"><div className={`${styles.cover} rotate-6 transition-transform duration-500 group-hover:rotate-3 motion-reduce:transition-none`}><Image src="/projects/zempled/artwork/916387672.jpg" alt="Distant Relatives album cover" width={150} height={150} /></div></ProjectPreviewMotion>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="display-heading text-2xl">Zempled</h3>
          <span className="text-[10px] uppercase tracking-wider text-foreground/45">Music discovery</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground/60">Ethiopian originals and the songs that sampled them. Listen side by side.</p>
        <ProjectCardMeta year={2026} technologies={["Deezer API", "HTML5 Audio", "Next.js", "React", "TypeScript", "Tailwind CSS"]} />
        <p className="mt-auto pt-7 text-xs text-foreground/70">
          <ProjectCardLink href="/projects/zempled" label="Explore Zempled">
            <ActionLinkLabel>Open the collection</ActionLinkLabel>
          </ProjectCardLink>
        </p>
      </div>
    </div>
  </article>;
}

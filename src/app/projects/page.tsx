import type { Metadata } from "next";
import ScrollReveal from "@/components/motion/scroll-reveal";
import { ProjectGrid, projectCards } from "@/features/projects/project-list";

export const metadata: Metadata = {
  title: "Projects · Yakob Getu",
  description:
    "Projects by Yakob Getu: Elsewhere, Zempled, Trace, Reversi–Othello, Fruitful, and Gradient, a collaborative AI grading tool.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 sm:px-10 sm:pt-28 lg:px-12">
      <ScrollReveal variant="title">
        <h1 className="display-heading mt-12 text-5xl sm:text-6xl">Projects</h1>
      </ScrollReveal>
      <p className="mt-5 max-w-lg text-sm leading-6 text-foreground/55">
        Things I&apos;m building, ideas I&apos;m exploring, and a little of the world outside my work.
      </p>

      <section className="mt-16" aria-labelledby="highlighted-projects">
        <div className="mb-6 flex items-center gap-5">
          <h2 id="highlighted-projects" className="text-xs uppercase tracking-[0.18em] text-foreground/50">
            Highlighted
          </h2>
          <div className="h-px flex-1 bg-foreground/10" />
        </div>
        <ProjectGrid cards={projectCards} />
      </section>
    </div>
  );
}

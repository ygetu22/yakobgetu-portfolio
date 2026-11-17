import type { Metadata } from "next";
import { SiteLink } from "@/components/layout/page-curtain";
import Reveal from "@/components/motion/reveal";
import WeightLetters from "@/components/motion/weight-letters";
import ProjectIndex from "@/features/projects/project-index";
import { projects } from "@/features/projects/projects";

export const metadata: Metadata = {
  title: "Projects · Yakob Getu",
  description: `Projects by Yakob Getu: ${projects.map((project) => project.name).join(", ")}.`,
};

export default function ProjectsPage() {
  return (
    <section className="section page-top" aria-labelledby="projects-title">
      <SiteLink href="/#projects" curtainTitle="Home" className="back-link">
        <span aria-hidden="true">←</span> Back to Home
      </SiteLink>
      <h1 id="projects-title" className="display-heading page-title">
        <WeightLetters text="Projects" restingWeight={300} decodeOnMount />
      </h1>
      <p className="muted" style={{ margin: "24px 0 40px" }}>
        {projects.length} projects so far.
      </p>
      <Reveal>
        <ProjectIndex projects={projects} />
      </Reveal>
    </section>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/features/projects/project-page";
import { projects } from "@/features/projects/projects";

// Projects without a page of their own (Fruitful, Gradient, Othello) share this one.
// Trace, Zempled and Elsewhere have their own folders next to this one, which take priority.
const sharedPageProjects = projects.filter((project) => project.highlights);

type ProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

function findProject(slug: string) {
  return sharedPageProjects.find((project) => project.id === slug);
}

export function generateStaticParams() {
  return sharedPageProjects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) return {};
  return { title: `${project.name} · Yakob Getu`, description: project.summary };
}

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return <ProjectPage project={project} />;
}

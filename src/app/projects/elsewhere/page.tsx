import type { Metadata } from "next";
import ProjectPage from "@/features/projects/project-page";
import { projects } from "@/features/projects/projects";

// The photo journal is being reworked (the old version is saved on the local branch
// elsewhere-journal-v1). Until it is back, this address shows the project's summary page,
// whose status says it is coming soon.
const elsewhere = projects.find((project) => project.id === "elsewhere")!;

export const metadata: Metadata = {
  title: "Elsewhere · Yakob Getu",
  description: elsewhere.summary,
};

export default function ElsewherePage() {
  return <ProjectPage project={elsewhere} />;
}
